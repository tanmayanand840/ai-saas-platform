import express from 'express';
import { auth } from '../middlewares/auth.js';
import { requirePremium } from '../middlewares/requirePremium.js';
import { resumeUpload, upload } from '../configs/multer.js';
import {
    generateArticle,
    generateBlogTitle,
    generateImage,
    removeImageBackground,
    removeImageObject,
    resumeReview,
    writeEmail,
    summarizeText,
    generateCoverLetter,
    reviewCode,
} from '../controllers/aiController.js';

const aiRouter = express.Router();

// Free + premium routes (usage-limited for free tier)
aiRouter.post('/generate-article',          auth, generateArticle);
aiRouter.post('/generate-blog-title',       auth, generateBlogTitle);
aiRouter.post('/generate-image',            auth, generateImage);
aiRouter.post('/remove-image-background',   auth, upload.single('image'), removeImageBackground);
aiRouter.post('/remove-image-object',       auth, upload.single('image'), removeImageObject);
aiRouter.post('/resume-review', auth, (req, res, next) => {
    resumeUpload.single('resume')(req, res, (error) => {
        if (!error) return next();

        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ success: false, message: 'Resume must be 10MB or smaller.' });
        }
        return res.status(400).json({ success: false, message: error.message || 'Please upload a PDF file.' });
    });
}, resumeReview);

// Premium-only routes
aiRouter.post('/write-email',               auth, requirePremium, writeEmail);
aiRouter.post('/summarize-text',            auth, requirePremium, summarizeText);
aiRouter.post('/generate-cover-letter',     auth, requirePremium, generateCoverLetter);
aiRouter.post('/review-code',               auth, requirePremium, reviewCode);

export default aiRouter;
