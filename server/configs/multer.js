import multer from "multer";

// Memory storage keeps files in req.file.buffer
// This is reliable across all environments and works well with Cloudinary streams
const storage = multer.memoryStorage();

export const upload = multer({ storage });

const MAX_RESUME_SIZE_BYTES = 10 * 1024 * 1024;

export const resumeUpload = multer({
    storage,
    limits: { fileSize: MAX_RESUME_SIZE_BYTES, files: 1 },
    fileFilter: (req, file, callback) => {
        if (file.mimetype !== "application/pdf") {
            return callback(new Error("Please upload a PDF file."));
        }
        callback(null, true);
    },
});
