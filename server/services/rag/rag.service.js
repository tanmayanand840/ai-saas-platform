import { v4 as uuidv4 } from 'uuid';
import { parseDocument } from '../../utils/document-parser.js';
import { chunkDocument } from './chunk.service.js';
import { embedDocuments } from './embedding.service.js';
import { upsertVectors, retrieveChunks, deleteVectorsByDocument } from './retrieval.service.js';
import { generateAnswer } from './generation.service.js';
import {
    createDocument,
    markDocumentCompleted,
    markDocumentFailed,
    getDocumentByIdAndUser,
    deleteDocument,
    DOC_STATUS,
} from './document.service.js';
import { COLLECTION_NAME } from '../../lib/qdrant.js';

// ── Config ────────────────────────────────────────────────────────────────────

const EMBEDDING_MODEL   = process.env.EMBEDDING_MODEL   || 'text-embedding-3-small';
const BATCH_SIZE        = 50; // embed this many chunks per OpenAI call

// ── Ingest pipeline ───────────────────────────────────────────────────────────

/**
 * Full ingestion pipeline:
 *   upload → parse → chunk → embed → upsert into Qdrant → update DB
 *
 * @param {{ buffer: Buffer, originalname: string, mimetype: string, size: number }} file
 * @param {string} userId
 * @returns {Promise<{ documentId: string, chunkCount: number }>}
 */
export const ingestDocument = async (file, userId) => {
    const documentId = uuidv4();
    const fileName   = sanitizeFileName(file.originalname);

    console.log(`[rag] ingest START documentId=${documentId} file="${fileName}" user=${userId}`);

    // ── 1. Create DB record (status=PROCESSING) ────────────────────────────────
    await createDocument({
        id:             documentId,
        userId,
        fileName,
        originalName:   file.originalname,
        mimeType:       file.mimetype,
        fileSize:       file.size,
        embeddingModel: EMBEDDING_MODEL,
        collectionName: COLLECTION_NAME,
    });

    try {
        // ── 2. Parse text from document ────────────────────────────────────────
        console.log(`[rag] parsing "${fileName}" (${file.mimetype})`);
        const parsedDoc = await parseDocument(file.buffer, file.mimetype);
        console.log(`[rag] extracted ${parsedDoc.text.length} chars, ${parsedDoc.pageCount} page(s)`);

        // ── 3. Split into chunks ───────────────────────────────────────────────
        const chunks = await chunkDocument(parsedDoc, { documentId, userId, fileName });
        console.log(`[rag] chunking completed: ${chunks.length} chunks`);

        if (chunks.length === 0) {
            throw new Error('Document produced no text chunks after splitting.');
        }

        // ── 4. Embed in batches ────────────────────────────────────────────────
        const points = [];
        for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
            const batch      = chunks.slice(i, i + BATCH_SIZE);
            const batchTexts = batch.map((c) => c.text);
            const vectors    = await embedDocuments(batchTexts);

            for (let j = 0; j < batch.length; j++) {
                const chunk = batch[j];
                points.push({
                    id:      uuidv4(),          // Qdrant point ID — must be UUID or uint64
                    vector:  vectors[j],
                    payload: {
                        userId,
                        documentId,
                        fileName,
                        chunkIndex:  chunk.chunkIndex,
                        pageNumber:  chunk.pageNumber,
                        text:        chunk.text,
                        source:      chunk.source,
                    },
                });
            }
            console.log(`[rag] embedded batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(chunks.length / BATCH_SIZE)}`);
        }

        // ── 5. Upsert into Qdrant ──────────────────────────────────────────────
        await upsertVectors(points);
        console.log(`[rag] upserted ${points.length} vectors into Qdrant`);

        // ── 6. Update DB status=COMPLETED ──────────────────────────────────────
        await markDocumentCompleted(documentId, chunks.length);
        console.log(`[rag] ingest COMPLETED documentId=${documentId} chunks=${chunks.length}`);

        return { documentId, chunkCount: chunks.length };

    } catch (err) {
        console.error(`[rag] ingest FAILED documentId=${documentId}:`, err.message);
        await deleteVectorsByDocument(documentId, userId).catch((cleanupError) => {
            console.error(`[rag] vector cleanup failed documentId=${documentId}:`, cleanupError.message);
        });
        await markDocumentFailed(documentId, err.message).catch(() => {});
        throw err;
    }
};

// ── Query pipeline ────────────────────────────────────────────────────────────

/**
 * RAG query pipeline:
 *   query → embed → Qdrant search (filtered by userId) → LLM → answer + sources
 *
 * @param {string}  query
 * @param {string}  userId
 * @param {string}  [documentId]   - Optional: restrict to one document
 * @returns {Promise<{ answer: string, sources: object[] }>}
 */
export const queryDocuments = async (query, userId, documentId = null) => {
    console.log(`[rag] query START user=${userId} documentId=${documentId ?? 'all'}`);

    // 1. Retrieve relevant chunks (userId filter enforced inside)
    const chunks = await retrieveChunks(query, userId, documentId);

    // 2. Generate grounded answer
    const { answer } = await generateAnswer(query, chunks);

    // 3. Build sources (no duplicates, clean shape)
    const sources = deduplicateSources(chunks);

    console.log(`[rag] query DONE answer_len=${answer.length} sources=${sources.length}`);
    return { answer, sources };
};

// ── Document deletion ─────────────────────────────────────────────────────────

/**
 * Delete a document: verify ownership, remove Qdrant vectors, remove DB row.
 *
 * @param {string} documentId
 * @param {string} userId
 * @returns {Promise<void>}
 */
export const removeDocument = async (documentId, userId) => {
    const doc = await getDocumentByIdAndUser(documentId, userId);
    if (!doc) {
        const err = new Error('Document not found or access denied.');
        err.status = 404;
        throw err;
    }

    // Delete Qdrant vectors first — if this fails we still have the DB row
    await deleteVectorsByDocument(documentId, userId);

    // Delete DB record
    await deleteDocument(documentId, userId);

    console.log(`[rag] document deleted documentId=${documentId} userId=${userId}`);
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const sanitizeFileName = (name) =>
    (name || 'document').replace(/[^a-zA-Z0-9._\- ]/g, '_').slice(0, 255);

const deduplicateSources = (chunks) => {
    const seen = new Set();
    const sources = [];
    for (const c of chunks) {
        const key = `${c.documentId}:${c.chunkIndex}`;
        if (!seen.has(key)) {
            seen.add(key);
            sources.push({
                documentId: c.documentId,
                fileName:   c.fileName,
                page:       c.pageNumber,
                chunkIndex: c.chunkIndex,
                score:      c.score,
            });
        }
    }
    return sources;
};
