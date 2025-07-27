import express from 'express'
import userMiddleware from '../middlerware/userMiddleware.js';
import { submitCode, runCode } from '../controllers/submisstionController.js';

const submitRouter = express.Router();


submitRouter.post("/submit/:id", userMiddleware, submitCode);
submitRouter.post("/run/:id",userMiddleware, runCode);


export default submitRouter;