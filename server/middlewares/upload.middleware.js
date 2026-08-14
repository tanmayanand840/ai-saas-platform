import multer from 'multer';
import path from 'path';
import { SUPPORTED_MIME_TYPES, SUPPORTED_EXTENSIONS } from '../utils/document-parser.js';

// ── Config ────────────────────────────────────────────────────────────────────

const MAX_FILE_SIZE_MB = parseInt(
    process.env.MAX_DOCUMENT_SIZE_MB || process.env.MAX_RAG_FILE_SIZE_MB || '10',
    10
);
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// ── Multer instance ───────────────────────────────────────────────────────────

const ragStorage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
    // Check MIME type
    if (!SUPPORTED_MIME_TYPES.has(file.mimetype)) {
        return callback(
            new Error(
                `Unsupported file type "${file.mimetype}". ` +
                `Allowed types: PDF, DOCX, TXT`
            ),
            false
        );
    }

    // Check file extension as a secondary guard
    const ext = path.extname(file.originalname).toLowerCase();
    if (!SUPPORTED_EXTENSIONS.has(ext)) {
        return callback(
            new Error(
                `Unsupported file extension "${ext}". ` +
                `Allowed: .pdf, .docx, .txt`
            ),
            false
        );
    }

    callback(null, true);
};

export const ragUpload = multer({
    storage:  ragStorage,
    limits: {
        fileSize: MAX_FILE_SIZE_BYTES,
        files:    1,
    },
    fileFilter,
});

// ── Error-handling wrapper ────────────────────────────────────────────────────

/**
 * Express middleware that runs ragUpload.single('document') and converts
 * multer errors into consistent JSON 4xx responses instead of 500s.
 */
export const ragUploadMiddleware = (req, res, next) => {
    ragUpload.single('document')(req, res, (err) => {
        if (!err) return next();

        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({
                success: false,
                message: `File is too large. Maximum allowed size is ${MAX_FILE_SIZE_MB} MB.`,
            });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: 'Only one file can be uploaded at a time.',
            });
        }
        if (err instanceof multer.MulterError) {
            return res.status(400).json({
                success: false,
                message: `Upload error: ${err.message}`,
            });
        }
        // Custom fileFilter error
        return res.status(400).json({
            success: false,
            message: err.message || 'Invalid file.',
        });
    });
};
