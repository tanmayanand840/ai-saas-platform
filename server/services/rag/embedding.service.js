import { OpenAIEmbeddings } from '@langchain/openai';

// ── Config ────────────────────────────────────────────────────────────────────

const PROVIDER = (process.env.EMBEDDING_PROVIDER || 'openrouter').toLowerCase();

// Default model differs per provider — OpenRouter needs the "openai/" prefix
// to route to the right upstream.
// Default OpenRouter model is NVIDIA's free embedding model, so RAG works
// with zero embedding cost out of the box.
const DEFAULT_MODELS = {
    openai:     'text-embedding-3-small',
    openrouter: 'nvidia/nemotron-3-embed-1b:free',
};
const MODEL = process.env.EMBEDDING_MODEL || DEFAULT_MODELS[PROVIDER] || 'text-embedding-3-small';

// Vector sizes by well-known model names — used for validation at startup.
// OpenAI models are listed both bare and "openai/"-prefixed since OpenRouter
// requires the provider prefix.
const KNOWN_VECTOR_SIZES = {
    'text-embedding-3-small': 1536,
    'text-embedding-3-large': 3072,
    'text-embedding-ada-002': 1536,
    'openai/text-embedding-3-small': 1536,
    'openai/text-embedding-3-large': 3072,
    'openai/text-embedding-ada-002': 1536,
    // Verified live against OpenRouter's /embeddings endpoint.
    'nvidia/nemotron-3-embed-1b:free': 2048,
};

// ── Validation ────────────────────────────────────────────────────────────────

/**
 * Call once at startup (e.g. from server.js or initQdrant).
 * Throws if the required API key is missing so the problem surfaces early.
 */
export const validateEmbeddingConfig = () => {
    if (PROVIDER === 'openai') {
        if (!process.env.OPENAI_API_KEY) {
            throw new Error(
                'OPENAI_API_KEY is required for EMBEDDING_PROVIDER=openai. ' +
                'Add it to your .env file.'
            );
        }
    } else if (PROVIDER === 'openrouter') {
        if (!process.env.OPENROUTER_API_KEY) {
            throw new Error(
                'OPENROUTER_API_KEY is required for EMBEDDING_PROVIDER=openrouter. ' +
                'Add it to your .env file.'
            );
        }
    } else {
        throw new Error(`Unsupported EMBEDDING_PROVIDER: "${PROVIDER}". Supported: openai, openrouter`);
    }
    console.log(`[embedding] provider=${PROVIDER} model=${MODEL}`);
};

// ── Client singleton ──────────────────────────────────────────────────────────

let _embeddings = null;

const getEmbeddings = () => {
    if (_embeddings) return _embeddings;

    if (PROVIDER === 'openai') {
        _embeddings = new OpenAIEmbeddings({
            openAIApiKey: process.env.OPENAI_API_KEY,
            modelName:    MODEL,
            // Batch size — OpenAI allows up to 2048 inputs per request
            batchSize: 512,
        });
    } else if (PROVIDER === 'openrouter') {
        // OpenRouter's /embeddings endpoint is OpenAI-request-compatible —
        // reuse the OpenAI client pointed at OpenRouter's base URL so we
        // don't need a separate OPENAI_API_KEY / OpenAI account.
        _embeddings = new OpenAIEmbeddings({
            openAIApiKey: process.env.OPENROUTER_API_KEY,
            modelName:    MODEL,
            batchSize: 512,
            // The OpenAI SDK defaults to requesting base64-encoded vectors,
            // which OpenRouter's non-OpenAI embedding models (e.g. NVIDIA's)
            // reject — force plain float arrays instead.
            encodingFormat: 'float',
            configuration: {
                baseURL: 'https://openrouter.ai/api/v1',
                defaultHeaders: {
                    'HTTP-Referer': process.env.APP_URL || 'http://localhost:5000',
                    'X-Title': 'AI SaaS App',
                },
            },
        });
    }

    return _embeddings;
};

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Embed an array of text strings (document chunks).
 * Returns a parallel array of float vectors.
 *
 * @param {string[]} texts
 * @returns {Promise<number[][]>}
 */
export const embedDocuments = async (texts) => {
    if (!texts || texts.length === 0) return [];
    const emb = getEmbeddings();
    const vectors = await emb.embedDocuments(texts);
    console.log(`[embedding] embedded ${texts.length} chunk(s) with ${MODEL}`);
    return vectors;
};

/**
 * Embed a single query string.
 * Returns a single float vector.
 *
 * @param {string} query
 * @returns {Promise<number[]>}
 */
export const embedQuery = async (query) => {
    const emb = getEmbeddings();
    const vector = await emb.embedQuery(query);
    return vector;
};

/**
 * Return the expected vector size for the configured model.
 * Used by Qdrant collection creation to set the right dimension.
 */
export const getVectorSize = () => {
    return KNOWN_VECTOR_SIZES[MODEL] ?? parseInt(process.env.EMBEDDING_VECTOR_SIZE || '1536', 10);
};
