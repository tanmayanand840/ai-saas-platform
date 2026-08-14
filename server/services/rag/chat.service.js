import sql from '../../configs/db.js';

export const migrateChatsTable = async () => {
    await sql`
        CREATE TABLE IF NOT EXISTS rag_chats (
            id           TEXT        PRIMARY KEY,
            user_id      TEXT        NOT NULL,
            document_ids JSONB       NOT NULL DEFAULT '[]'::jsonb,
            messages     JSONB       NOT NULL DEFAULT '[]'::jsonb,
            created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `;

    await sql`
        CREATE INDEX IF NOT EXISTS idx_rag_chats_user_id
        ON rag_chats (user_id)
    `;

    console.log('[chat.service] rag_chats table ready');
};

export const createChatRecord = async ({ id, userId, documentIds, messages }) => {
    const [row] = await sql`
        INSERT INTO rag_chats (id, user_id, document_ids, messages)
        VALUES (${id}, ${userId}, ${JSON.stringify(documentIds)}, ${JSON.stringify(messages)})
        RETURNING *
    `;
    return row;
};

export const getChatsByUser = async (userId, limit = 25) => {
    return sql`
        SELECT *
        FROM rag_chats
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
        LIMIT ${limit}
    `;
};
