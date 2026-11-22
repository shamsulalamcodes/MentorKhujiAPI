import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv'
import { MongoClient, ObjectId } from 'mongodb';
dotenv.config()

const app = express();
app.use(express.json())
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

//custom Express middlewares: verifyToken, verifyStudent, verifyTutor, and verifyAdmin

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

app.get('/latestTutions', async (req, res) => {
    const ress = await tutionsCollection.find({ approvalStatus: "approved" }).sort({ createdAt: -1 }).limit(6).toArray()
    res.send(ress)
})

app.get('/approvedTutions', async (req, res) => {
    const ress = await tutionsCollection.find({ approvalStatus: "approved", isActive: true }).sort({ createdAt: -1 }).toArray()
    res.send(ress)
})

app.get('/tution/:id', async (req, res) => {
    const ees = await tutionsCollection.findOne({ _id: new ObjectId(req.params.id) })
    res.send(ees)
})

app.patch("/users/:id", async (req, res) => {
    const { name, email, photo } = req.body
    const update = { name, email, ...(photo && { image: photo }) }
    const result = await usersCollection.updateOne({ _id: new ObjectId(req.params.id) }, { $set: update })
    if (result.modifiedCount > 0) res.json(await usersCollection.findOne({ _id: new ObjectId(req.params.id) }))
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});