import app from './app.js';
import 'dotenv/config';
import ConnectMongoDB from './config/mongoDB.js'
import redisClient from './config/redis.js';


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