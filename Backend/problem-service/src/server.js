import app from './app.js';
import 'dotenv/config';
import ConnectMongoDB from './config/mongoDB.js'
import redisClient from './config/redis.js';  


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root .env ka path
dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });


async function initializeConnection() {
    try {
        Promise.all([ConnectMongoDB()])
            .then(() => {
                console.log("Databases connected")
                app.listen(process.env.PORT, () => {
                    console.log("Problem Server is running at PORT", process.env.PORT);
                })
            })
            .catch((error => console.log("Databases are not connected and Error is " + error)))
    } catch (error) {
        console.log("Error at initializeConnection ", error);
    }
}


initializeConnection()