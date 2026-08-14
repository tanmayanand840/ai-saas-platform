import pdf from 'pdf-parse/lib/pdf-parse.js';
import mammoth from 'mammoth';

const cleanText = (value) =>
    String(value || '')
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .replace(/[ \t]+/g, ' ')
        .replace(/\n[ \t]+/g, '\n')
        .replace(/[ \t]+\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

// ── Supported types ───────────────────────────────────────────────────────────

export const SUPPORTED_MIME_TYPES = new Set([
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'text/plain',
]);

export const SUPPORTED_EXTENSIONS = new Set(['.pdf', '.docx', '.txt']);

// ── Result shape ──────────────────────────────────────────────────────────────

/**
 * @typedef {Object} ParsedDocument
 * @property {string}   text        - Full extracted text
 * @property {number}   pageCount   - Number of pages (1 for non-PDF)
 * @property {Array<{pageNumber: number, text: string}>} pages - Per-page text (PDF only)
 */

// ── Parsers ───────────────────────────────────────────────────────────────────

const parsePdf = async (buffer) => {
    // Validate PDF magic bytes
    if (!buffer.subarray(0, 5).toString('ascii').startsWith('%PDF-')) {
        throw new Error('File does not appear to be a valid PDF.');
    }

    const data = await pdf(buffer);

    if (!data.text || data.text.trim().length < 10) {
        throw new Error('No extractable text found. Please upload a text-based PDF (not a scanned image).');
    }

    // Build per-page breakdown when pdf-parse provides it
    // pdf-parse exposes data.text as the full concatenated text.
    // For page-level metadata we parse the raw text by the form-feed character
    // that pdf-parse inserts between pages.
    const pageTexts = data.text
        .split(/\f/)                        // form-feed = page break in pdf-parse
        .map((t) => cleanText(t))
        .filter(Boolean);

    const pages = pageTexts.map((text, i) => ({ pageNumber: i + 1, text }));

    return {
        text: cleanText(data.text),
        pageCount: data.numpages || pages.length,
        pages,
    };
};

const parseDocx = async (buffer) => {
    const result = await mammoth.extractRawText({ buffer });

    if (result.messages && result.messages.length > 0) {
        result.messages.forEach((m) => console.warn('[document-parser] mammoth warning:', m.message));
    }

    const text = cleanText(result.value || '');
    if (!text || text.length < 10) {
        throw new Error('No extractable text found in the DOCX file.');
    }

    return {
        text,
        pageCount: 1,   // DOCX has no reliable page count without rendering
        pages: [{ pageNumber: 1, text }],
    };
};

const parseTxt = (buffer) => {
    const text = cleanText(buffer.toString('utf-8'));

    if (!text || text.length < 10) {
        throw new Error('The text file appears to be empty.');
    }

    // Split into "pages" by double newline blocks for consistent metadata
    const blocks = text.split(/\n{3,}/).map((t) => t.trim()).filter(Boolean);
    const pages = blocks.length > 0
        ? blocks.map((t, i) => ({ pageNumber: i + 1, text: t }))
        : [{ pageNumber: 1, text }];

    return {
        text,
        pageCount: pages.length,
        pages,
    };
};

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Extract text from a file buffer.
 *
 * @param {Buffer} buffer
 * @param {string} mimeType
 * @returns {Promise<ParsedDocument>}
 */
export const parseDocument = async (buffer, mimeType) => {
    switch (mimeType) {
        case 'application/pdf':
            return parsePdf(buffer);

        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            return parseDocx(buffer);

        case 'text/plain':
            return parseTxt(buffer);

        default:
            throw new Error(`Unsupported file type: ${mimeType}`);
    }
};
