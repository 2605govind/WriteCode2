import express from 'express'
import userMiddleware from '../middlerware/userMiddleware.js';
import { solveDoubt } from '../controllers/AIController.js';

const aiRouter = express.Router();

aiRouter.post('/chat', userMiddleware, solveDoubt);

export default aiRouter;