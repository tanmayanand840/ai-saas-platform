import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

// ── Config ────────────────────────────────────────────────────────────────────

const CHUNK_SIZE    = parseInt(process.env.RAG_CHUNK_SIZE    || '1000', 10);
const CHUNK_OVERLAP = parseInt(process.env.RAG_CHUNK_OVERLAP || '150',  10);

// ── Splitter singleton ────────────────────────────────────────────────────────

let _splitter = null;

const getSplitter = () => {
    if (!_splitter) {
        _splitter = new RecursiveCharacterTextSplitter({
            chunkSize:    CHUNK_SIZE,
            chunkOverlap: CHUNK_OVERLAP,
            // Separators tried in order — prefer paragraph, then sentence, then word
            separators: ['\n\n', '\n', '. ', ' ', ''],
        });
    }
    return _splitter;
};

// ── Types ─────────────────────────────────────────────────────────────────────

/**
 * @typedef {Object} DocumentChunk
 * @property {string} text        - Chunk text content
 * @property {number} chunkIndex  - 0-based position in the document
 * @property {number} pageNumber  - Source page (best-effort from pages array)
 * @property {string} documentId  - DB document ID
 * @property {string} userId      - Owner Clerk user ID
 * @property {string} fileName    - Original file name
 * @property {string} source      - Descriptive source label
 */

// ── Core function ─────────────────────────────────────────────────────────────

/**
 * Split a parsed document into overlapping chunks with full metadata.
 *
 * @param {import('../../utils/document-parser.js').ParsedDocument} parsedDoc
 * @param {{ documentId: string, userId: string, fileName: string }} meta
 * @returns {Promise<DocumentChunk[]>}
 */
export const chunkDocument = async (parsedDoc, meta) => {
    const { documentId, userId, fileName } = meta;
    const splitter = getSplitter();

    // Build page-boundary map so each chunk can carry a page number.
    // Map: character offset → page number
    const pageMap = buildPageOffsetMap(parsedDoc.pages);

    const rawChunks = await splitter.splitText(parsedDoc.text);

    const chunks = rawChunks.map((text, chunkIndex) => {
        // Find the character offset of this chunk in the full text
        const offset = parsedDoc.text.indexOf(text);
        const pageNumber = resolvePageNumber(offset, pageMap);

        return {
            text,
            chunkIndex,
            pageNumber,
            documentId,
            userId,
            fileName,
            source: `${fileName} — page ${pageNumber}`,
        };
    });

    console.log(`[chunk] "${fileName}" → ${chunks.length} chunks (size=${CHUNK_SIZE}, overlap=${CHUNK_OVERLAP})`);
    return chunks;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Build an array of { startOffset, pageNumber } from per-page texts.
 * Used to map a character offset back to a page number.
 */
const buildPageOffsetMap = (pages) => {
    const map = [];
    let offset = 0;
    for (const page of pages) {
        map.push({ startOffset: offset, pageNumber: page.pageNumber });
        offset += page.text.length + 1; // +1 for separator
    }
    return map;
};

/**
 * Given a character offset in the full document text, return the page number.
 */
const resolvePageNumber = (offset, pageMap) => {
    if (offset < 0 || pageMap.length === 0) return 1;
    let page = 1;
    for (const entry of pageMap) {
        if (offset >= entry.startOffset) {
            page = entry.pageNumber;
        } else {
            break;
        }
    }
    return page;
};
