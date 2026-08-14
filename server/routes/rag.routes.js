import { Router } from 'express';
import { auth } from '../middlewares/auth.js';
import { requirePremium } from '../middlewares/requirePremium.js';
import { ragUploadMiddleware } from '../middlewares/upload.middleware.js';
import {
    uploadDocument,
    listDocuments,
    getDocument,
    deleteDocumentHandler,
    queryHandler,
    listChats,
    healthHandler,
} from '../controllers/rag.controller.js';

const ragRouter = Router();

// ── Health (no auth needed — used by k8s liveness probes and monitoring) ──────
ragRouter.get('/health', healthHandler);

// ── All routes below require authentication ───────────────────────────────────

const premium = [auth, requirePremium];

// Documents CRUD
ragRouter.post('/documents',        ...premium, ragUploadMiddleware, uploadDocument);
ragRouter.post('/documents/upload', ...premium, ragUploadMiddleware, uploadDocument);
ragRouter.get('/documents',         ...premium, listDocuments);
ragRouter.get('/documents/:id',     ...premium, getDocument);
ragRouter.delete('/documents/:id',  ...premium, deleteDocumentHandler);

// RAG query
ragRouter.post('/query', ...premium, queryHandler);
ragRouter.post('/chat',  ...premium, queryHandler);
ragRouter.get('/chats',  ...premium, listChats);

export default ragRouter;
