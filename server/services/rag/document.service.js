import sql from '../../configs/db.js';

// ── Status constants ──────────────────────────────────────────────────────────

export const DOC_STATUS = Object.freeze({
    UPLOADED:   'UPLOADED',
    PROCESSING: 'PROCESSING',
    COMPLETED:  'COMPLETED',
    FAILED:     'FAILED',
});

// ── Migration helper ──────────────────────────────────────────────────────────

/**
 * Creates the rag_documents table if it does not already exist.
 * Called once at server startup from initQdrant / server.js.
 */
export const migrateDocumentsTable = async () => {
    await sql`
        CREATE TABLE IF NOT EXISTS rag_documents (
            id              TEXT        PRIMARY KEY,
            user_id         TEXT        NOT NULL,
            file_name       TEXT        NOT NULL,
            original_name   TEXT        NOT NULL,
            mime_type       TEXT        NOT NULL,
            file_size       INTEGER     NOT NULL,
            status          TEXT        NOT NULL DEFAULT 'UPLOADED',
            chunk_count     INTEGER     NOT NULL DEFAULT 0,
            storage_path    TEXT,
            embedding_model TEXT,
            collection_name TEXT,
            processing_error TEXT,
            created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `;

    // Index for fast per-user queries
    await sql`
        CREATE INDEX IF NOT EXISTS idx_rag_documents_user_id
        ON rag_documents (user_id)
    `;

    console.log('[document.service] rag_documents table ready');
};

// ── CRUD ──────────────────────────────────────────────────────────────────────

/**
 * Create a new document record.
 * Returns the full row.
 */
export const createDocument = async ({
    id,
    userId,
    fileName,
    originalName,
    mimeType,
    fileSize,
    embeddingModel,
    collectionName,
}) => {
    const [row] = await sql`
        INSERT INTO rag_documents
            (id, user_id, file_name, original_name, mime_type, file_size,
             status, embedding_model, collection_name)
        VALUES
            (${id}, ${userId}, ${fileName}, ${originalName}, ${mimeType}, ${fileSize},
             ${DOC_STATUS.PROCESSING}, ${embeddingModel ?? null}, ${collectionName ?? null})
        RETURNING *
    `;
    return row;
};

/**
 * Fetch all documents belonging to a user.
 */
export const getDocumentsByUser = async (userId) => {
    return sql`
        SELECT * FROM rag_documents
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
    `;
};

/**
 * Fetch a single document by ID.
 * Returns null if not found.
 */
export const getDocumentById = async (id) => {
    const [row] = await sql`
        SELECT * FROM rag_documents
        WHERE id = ${id}
    `;
    return row ?? null;
};

/**
 * Fetch a document and verify it belongs to userId.
 * Returns null if not found or ownership mismatch.
 */
export const getDocumentByIdAndUser = async (id, userId) => {
    const [row] = await sql`
        SELECT * FROM rag_documents
        WHERE id = ${id}
          AND user_id = ${userId}
    `;
    return row ?? null;
};

/**
 * Mark a document as successfully processed.
 */
export const markDocumentCompleted = async (id, chunkCount) => {
    const [row] = await sql`
        UPDATE rag_documents
        SET status      = ${DOC_STATUS.COMPLETED},
            chunk_count = ${chunkCount},
            updated_at  = NOW()
        WHERE id = ${id}
        RETURNING *
    `;
    return row;
};

/**
 * Mark a document as failed with an error message.
 */
export const markDocumentFailed = async (id, errorMessage) => {
    const [row] = await sql`
        UPDATE rag_documents
        SET status           = ${DOC_STATUS.FAILED},
            processing_error = ${String(errorMessage).slice(0, 1000)},
            updated_at       = NOW()
        WHERE id = ${id}
        RETURNING *
    `;
    return row;
};

/**
 * Hard-delete a document record from the DB.
 * Callers must first delete Qdrant vectors.
 */
export const deleteDocument = async (id, userId) => {
    const [row] = await sql`
        DELETE FROM rag_documents
        WHERE id      = ${id}
          AND user_id = ${userId}
        RETURNING id
    `;
    return row ?? null;
};

/**
 * Count documents owned by a user (for quota enforcement).
 */
export const countDocumentsByUser = async (userId) => {
    const [row] = await sql`
        SELECT COUNT(*) AS count
        FROM rag_documents
        WHERE user_id = ${userId}
    `;
    return parseInt(row.count, 10);
};
