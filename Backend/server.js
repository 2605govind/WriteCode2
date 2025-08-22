import express from 'express';
import dotenv from "dotenv";
import cors from 'cors'
import path from 'path';
import { fileURLToPath } from 'url';

import backend1 from './auth-service/src/app.js'
import backend2 from './problem-service/src/app.js'


import AuthConnectMongoD from './auth-service/src/config/mongoDB.js'
import AuthredisClient from './auth-service/src/config/redis.js';


import ProblemConnectMongoDB from './problem-service/src/config/mongoDB.js'
import ProblemredisClient from './problem-service/src/config/redis.js';  


const server = express();


const PORT = process.env.PORT || 5001;

server.use(cors({
    origin: "http://localhost:5173", 
    credentials: true,
}))



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });


server.use('/backend1', backend1);
server.use('/backend2', backend2);

// server.get("/", (req, res) => {
//     res.send("hello govind");
// })

  server.use(express.static(path.join(__dirname, "..", "Frontend/dist")));

  server.get("/{*splat}", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "Frontend", "dist", "index.html"));

  });


async function initializeConnection() {
    try {
        Promise.all([AuthConnectMongoD(), ProblemConnectMongoDB()])
            .then(() => {
                console.log("Databases connected")

                // server start
                server.listen(PORT, () => {
                    console.log("Authentication-Service and Problem-Service Server is running at PORT", process.env.PORT);
                })
            })
            .catch((error => console.log("Databases are not connected and Error is " + error)))
    } catch (error) {
        console.log("Error at initializeConnection ", error);
    }
}


initializeConnection()


