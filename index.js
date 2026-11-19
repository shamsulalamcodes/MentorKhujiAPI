import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv'
import { MongoClient } from 'mongodb';
dotenv.config()

const app = express();
app.use(cors())
const port = process.env.PORT || 4000;

const client = new MongoClient(process.env.MONGO);
const db = client.db('mentorKhuji')
const usersCollection = db.collection("user");
const tutionsCollection = db.collection("tutions");
const applicationsCollection = db.collection("applications");
const paymentsCollection = db.collection("payments");

export async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("You successfully connected to MongoDB!");
        return client;
    } catch (err) {
        console.dir(err);
    }
}

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/applications', async (req, res) => {
    const ress = await applicationsCollection.find().toArray()
    res.send(ress)
})

app.get('/tutions', async (req, res) => {
    const ress = await tutionsCollection.find().toArray()
    res.send(ress)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});