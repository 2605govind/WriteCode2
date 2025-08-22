import express from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser'
import problemRouter from './routes/problemRouter.js';
import submitRouter from './routes/submitRouter.js';
import aiRouter from './routes/IntelliChatRouter.js';


const app = express();

app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));


app.use(cookieParser());





app.use('/api/v1/problem', problemRouter);
app.use('/api/v1/problem/submission',submitRouter);
app.use('/api/v1/ai',aiRouter);

app.use(express.urlencoded({ extended: true }));


app.use("/", (req, res) => {
    res.status(200).send("problem service");
})



export default app;