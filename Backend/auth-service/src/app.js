import express from 'express'
import authRoutes from './routes/authUserRoutes.js'
import cors from 'cors';
import cookieParser from 'cookie-parser'
import registeredAccountRoutes from './routes/registeredAccountRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import courseRoutes from './routes/courseRoutes.js';

const app = express();

app.use(express.json());

// app.use(cors({
//   origin: [process.env.FRONTEND_URL, process.env.PROBLEMSERVICE],
//   credentials: true,
// }));

app.use(cars());

app.use(cookieParser());



app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/registerduser', registeredAccountRoutes);
app.use('/api/v1/service', serviceRoutes); 
app.use('/api/v1/course', courseRoutes); 


app.use("/", (req, res) => {
    // console.log(req.body);
    res.send("auth service");
})

export default app;