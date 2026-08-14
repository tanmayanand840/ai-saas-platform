import { getQdrantClient, COLLECTION_NAME } from '../../lib/qdrant.js';
import { embedQuery } from './embedding.service.js';

// ── Config ────────────────────────────────────────────────────────────────────

const TOP_K           = parseInt(process.env.RAG_TOP_K            || '5',   10);
const SCORE_THRESHOLD = parseFloat(process.env.RAG_SCORE_THRESHOLD || '0.0');

// ── Types ─────────────────────────────────────────────────────────────────────

/**
 * @typedef {Object} RetrievedChunk
 * @property {string} text
 * @property {string} documentId
 * @property {string} fileName
 * @property {number} chunkIndex
 * @property {number} pageNumber
 * @property {number} score
 */

// ── Core function ─────────────────────────────────────────────────────────────

/**
 * Embed a query and retrieve the most relevant chunks from Qdrant.
 * Enforces userId isolation — users can only retrieve their own vectors.
 *
 * @param {string}  query
 * @param {string}  userId        - Clerk user ID (mandatory for isolation)
 * @param {string}  [documentId]  - Optional: restrict to a single document
 * @param {number}  [topK]        - Override top-K from env
 * @returns {Promise<RetrievedChunk[]>}
 */
export const retrieveChunks = async (query, userId, documentId = null, topK = TOP_K) => {
    console.log(`[retrieval] query="${query.slice(0, 80)}..." userId=${userId} documentId=${documentId ?? 'all'}`);

    // 1. Embed the query
    const queryVector = await embedQuery(query);

    // 2. Build Qdrant filter — userId is ALWAYS enforced
    const mustClauses = [
        {
            key: 'userId',
            match: { value: userId },
        },
    ];

    if (documentId) {
        mustClauses.push({
            key: 'documentId',
            match: { value: documentId },
        });
    }

    const filter = { must: mustClauses };

    // 3. Similarity search
    const client = getQdrantClient();
    const { points: results } = await client.query(COLLECTION_NAME, {
        query:       queryVector,
        limit:       topK,
        filter,
        with_payload: true,
        score_threshold: SCORE_THRESHOLD > 0 ? SCORE_THRESHOLD : undefined,
    });

    // 4. Map to clean shape — never expose raw Qdrant internals
    const chunks = results.map((hit) => ({
        text:       hit.payload.text        ?? '',
        documentId: hit.payload.documentId  ?? '',
        fileName:   hit.payload.fileName    ?? '',
        chunkIndex: hit.payload.chunkIndex  ?? 0,
        pageNumber: hit.payload.pageNumber  ?? 1,
        score:      Math.round(hit.score * 1000) / 1000,
    }));

    console.log(`[retrieval] returned ${chunks.length} chunk(s) (top score: ${chunks[0]?.score ?? 'n/a'})`);
    return chunks;
};

// ── Deletion helper ───────────────────────────────────────────────────────────

/**
 * Delete all Qdrant vectors for a given documentId (and optionally userId as safety check).
 * Called when a user deletes a document.
 */
export const deleteVectorsByDocument = async (documentId, userId) => {
    const client = getQdrantClient();

    await client.delete(COLLECTION_NAME, {
        filter: {
            must: [
                { key: 'documentId', match: { value: documentId } },
                { key: 'userId',     match: { value: userId } },
            ],
        },
    });

    console.log(`[retrieval] deleted vectors for documentId=${documentId} userId=${userId}`);
};

// ── Upsert helper ─────────────────────────────────────────────────────────────

/**
 * Upsert a batch of chunk vectors into Qdrant.
 *
 * @param {Array<{ id: string, vector: number[], payload: object }>} points
 */
export const upsertVectors = async (points) => {
    if (points.length === 0) return;
    const client = getQdrantClient();

    await client.upsert(COLLECTION_NAME, {
        wait:   true,
        points,
    });

    console.log(`[retrieval] upserted ${points.length} vector(s)`);
};
