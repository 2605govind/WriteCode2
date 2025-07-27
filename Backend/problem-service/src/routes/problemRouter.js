import express from 'express'
import adminMiddleware from '../middlerware/adminMiddleware.js';
import userMiddleware from '../middlerware/userMiddleware.js';
import { createProblem, updateProblem, deleteProblem, getProblemById, getAllProblem, getAllTagsWithCount, solvedAllProblembyUser, companyProblems, submittedProblem } from '../controllers/problemController.js';

const problemRouter = express.Router();


// create problem
problemRouter.post("/create", adminMiddleware ,createProblem);

// update problem
problemRouter.put("/update/:id",adminMiddleware, updateProblem);

// // delete problem
problemRouter.delete("/delete/:id",adminMiddleware, deleteProblem);

// // get problem by id
problemRouter.get("/problemById/:id",userMiddleware, getProblemById);


// // get problems by tags in form of pagination

// /api/problems → returns all problems (paginated).
// /api/problems?difficulty=easy → returns all easy problems.
// /api/problems?tags=array,math → returns problems that have both tags.
// /api/problems?difficulty=medium&tags=dp → filters by both.
problemRouter.get("/getproblems",userMiddleware, getAllProblem); // /api/problems?page=1&limit=10&difficulty=medium&tags=array,math


problemRouter.get("/getalltagswithcount",userMiddleware, getAllTagsWithCount);

// // get problems solved by user
problemRouter.get("/problemSolvedByUser",userMiddleware, solvedAllProblembyUser);


problemRouter.get("/companyproblems",userMiddleware, companyProblems);

// /// get user solved problem submission
problemRouter.get("/submittedProblem/:pid",userMiddleware,submittedProblem);


export default problemRouter;