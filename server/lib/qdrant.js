import { QdrantClient } from '@qdrant/js-client-rest';
import { getVectorSize, validateEmbeddingConfig } from '../services/rag/embedding.service.js';

// ── Client singleton ──────────────────────────────────────────────────────────

let _client = null;

export const getQdrantClient = () => {
    if (_client) return _client;

    const url = process.env.QDRANT_URL;
    const apiKey = process.env.QDRANT_API_KEY;

    if (!url || !apiKey) {
        throw new Error('QDRANT_URL and QDRANT_API_KEY are required for AI Document Chat.');
    }

    _client = new QdrantClient({ url, apiKey });
    return _client;
};

// ── Constants ─────────────────────────────────────────────────────────────────

export const COLLECTION_NAME =
    process.env.QDRANT_COLLECTION_NAME ||
    process.env.QDRANT_COLLECTION ||
    'ai_saas_documents';

// Vector size must match the embedding model.
// text-embedding-3-small  → 1536
// text-embedding-ada-002  → 1536
// text-embedding-3-large  → 3072
// Configurable via env so switching models doesn't require a code change.
export const VECTOR_SIZE = getVectorSize();

// ── Collection bootstrap ──────────────────────────────────────────────────────

/**
 * Ensures the Qdrant collection exists.
 * Called once at server startup.  Safe to call multiple times.
 */
export const ensureCollection = async () => {
    const client = getQdrantClient();

    const { collections } = await client.getCollections();
    const exists = collections.some((c) => c.name === COLLECTION_NAME);

    if (!exists) {
        await client.createCollection(COLLECTION_NAME, {
            vectors: {
                size: VECTOR_SIZE,
                distance: 'Cosine',
            },
            // Payload indexes for fast filtered search
            optimizers_config: {
                indexing_threshold: 20000,
            },
        });

        // Create payload indexes so userId + documentId filters are fast
        await client.createPayloadIndex(COLLECTION_NAME, {
            field_name: 'userId',
            field_schema: 'keyword',
        });
        await client.createPayloadIndex(COLLECTION_NAME, {
            field_name: 'documentId',
            field_schema: 'keyword',
        });

        console.log(`[Qdrant] Collection "${COLLECTION_NAME}" created (vector size ${VECTOR_SIZE})`);
    } else {
        console.log(`[Qdrant] Collection "${COLLECTION_NAME}" already exists`);
    }
};

// ── Health check ──────────────────────────────────────────────────────────────

/**
 * Returns true if Qdrant is reachable, false otherwise.
 * Does NOT throw — callers decide how to handle unavailability.
 */
export const isQdrantHealthy = async () => {
    try {
        const client = getQdrantClient();
        await client.getCollections();
        return true;
    } catch (err) {
        console.error('[Qdrant] health check failed:', err.message);
        return false;
    }
};

/**
 * Startup initializer — call from server.js.
 * Logs a warning instead of crashing if Qdrant is unreachable so the
 * rest of the SaaS remains functional.
 */
export const initQdrant = async () => {
    try {
        validateEmbeddingConfig();
        await ensureCollection();
        console.log('[Qdrant] initialized successfully');
    } catch (err) {
        console.error('[Qdrant] initialization failed — RAG features will be unavailable:', err.message);
        // Intentionally not re-throwing: other features must continue working
    }
};
