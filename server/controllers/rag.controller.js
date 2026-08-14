import {
    ingestDocument,
    queryDocuments,
    removeDocument,
} from '../services/rag/rag.service.js';
import {
    getDocumentsByUser,
    getDocumentByIdAndUser,
    countDocumentsByUser,
} from '../services/rag/document.service.js';
import { createChatRecord, getChatsByUser } from '../services/rag/chat.service.js';
import { isQdrantHealthy } from '../lib/qdrant.js';
import { v4 as uuidv4 } from 'uuid';

// ── Config ────────────────────────────────────────────────────────────────────

const MAX_DOCS_PER_USER = parseInt(process.env.MAX_DOCS_PER_USER || '50', 10);

// ── Helpers ───────────────────────────────────────────────────────────────────

const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// ── Upload document  POST /api/rag/documents ──────────────────────────────────

export const uploadDocument = asyncHandler(async (req, res) => {
    const userId = req.authenticatedUserId;
    const file   = req.file;

    if (!file) {
        return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }
    if (file.size === 0) {
        return res.status(400).json({ success: false, message: 'Uploaded file is empty.' });
    }

    // Per-user document quota
    const currentCount = await countDocumentsByUser(userId);
    if (currentCount >= MAX_DOCS_PER_USER) {
        return res.status(429).json({
            success: false,
            message: `Document limit reached (${MAX_DOCS_PER_USER}). Delete some documents before uploading new ones.`,
        });
    }

    console.log(`[rag.controller] upload user=${userId} file="${file.originalname}" size=${file.size}`);

    const { documentId, chunkCount } = await ingestDocument(file, userId);

    return res.status(201).json({
        success:    true,
        documentId,
        chunkCount,
        message:    'Document uploaded and processed successfully.',
    });
});

// ── List documents  GET /api/rag/documents ────────────────────────────────────

export const listDocuments = asyncHandler(async (req, res) => {
    const userId = req.authenticatedUserId;
    const docs   = await getDocumentsByUser(userId);

    return res.json({
        success:   true,
        documents: docs.map(formatDocument),
    });
});

// ── Get single document  GET /api/rag/documents/:id ──────────────────────────

export const getDocument = asyncHandler(async (req, res) => {
    const userId = req.authenticatedUserId;
    const doc    = await getDocumentByIdAndUser(req.params.id, userId);

    if (!doc) {
        return res.status(404).json({ success: false, message: 'Document not found.' });
    }

    return res.json({ success: true, document: formatDocument(doc) });
});

// ── Delete document  DELETE /api/rag/documents/:id ───────────────────────────

export const deleteDocumentHandler = asyncHandler(async (req, res) => {
    const userId = req.authenticatedUserId;

    await removeDocument(req.params.id, userId);

    return res.json({ success: true, message: 'Document deleted successfully.' });
});

// ── Query  POST /api/rag/query ────────────────────────────────────────────────

export const queryHandler = asyncHandler(async (req, res) => {
    const userId = req.authenticatedUserId;
    const { documentId } = req.body;
    const query = req.body.question ?? req.body.query;

    if (!query || typeof query !== 'string' || !query.trim()) {
        return res.status(400).json({ success: false, message: 'Please provide a question.' });
    }
    if (query.trim().length > 1000) {
        return res.status(400).json({ success: false, message: 'Query is too long (max 1000 characters).' });
    }

    // Optional: verify the target document belongs to the user
    if (documentId) {
        const doc = await getDocumentByIdAndUser(documentId, userId);
        if (!doc) {
            return res.status(404).json({ success: false, message: 'Document not found.' });
        }
    }

    console.log(`[rag.controller] query user=${userId} documentId=${documentId ?? 'all'}`);

    const { answer, sources } = await queryDocuments(
        query.trim(),
        userId,
        documentId ?? null
    );

    const sourceDocumentIds = [...new Set(sources.map((source) => source.documentId).filter(Boolean))];
    await createChatRecord({
        id: uuidv4(),
        userId,
        documentIds: documentId ? [documentId] : sourceDocumentIds,
        messages: [
            { role: 'user', content: query.trim(), timestamp: new Date().toISOString() },
            { role: 'assistant', content: answer, timestamp: new Date().toISOString() },
        ],
    });

    return res.json({ success: true, answer, sources });
});

// ── Chat history  GET /api/rag/chats ──────────────────────────────────────────

export const listChats = asyncHandler(async (req, res) => {
    const rows = await getChatsByUser(req.authenticatedUserId);
    return res.json({
        success: true,
        chats: rows.map((row) => ({
            id: row.id,
            documentIds: row.document_ids,
            messages: row.messages,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        })),
    });
});

// ── Health  GET /api/rag/health ───────────────────────────────────────────────

export const healthHandler = asyncHandler(async (req, res) => {
    const healthy = await isQdrantHealthy();
    return res.status(healthy ? 200 : 503).json({
        success: healthy,
        qdrant:  healthy ? 'ok' : 'unavailable',
    });
});

// ── Private helpers ───────────────────────────────────────────────────────────

/**
 * Map a DB row to the public API shape.
 * Never expose internal fields like user_id directly.
 */
const formatDocument = (row) => ({
    id:             row.id,
    fileName:       row.file_name,
    originalName:   row.original_name,
    mimeType:       row.mime_type,
    fileSize:       row.file_size,
    status:         row.status,
    chunkCount:     row.chunk_count,
    embeddingModel: row.embedding_model,
    processingError: row.processing_error ?? undefined,
    createdAt:      row.created_at,
    updatedAt:      row.updated_at,
});
