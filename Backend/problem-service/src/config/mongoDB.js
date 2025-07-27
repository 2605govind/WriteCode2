import mongoose from 'mongoose';
import 'dotenv/config';

function ConnectMongoDB() {

    mongoose.connect(process.env.MongoDBUrl, {
        dbName: "WriteCode"
    }).then(() => {
        console.log("Mongo DB has Connected");

    }).catch((error) => {
        console.log("Error at MondoDB.js file", error)
    })

}

export default ConnectMongoDB;