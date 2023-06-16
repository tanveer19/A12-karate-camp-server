const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3nmy0xp.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();

    const instructorCollection = client
      .db("A12-karate-camp")
      .collection("instructors");
    const classesCollection = client
      .db("A12-karate-camp")
      .collection("classes");

    app.get("/instructors", async (req, res) => {
      const cursor = instructorCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You are successfully connected to MongoDB!"
    );

    app.post("/postClasses", async (req, res) => {
      const body = req.body;
      const result = await classesCollection.insertOne(body);
      console.log(result);
      res.send(result);
    });

    app.get("/allclasses", async (req, res) => {
      const result = await classesCollection.find({}).toArray();
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("karate running");
});

app.listen(port, () => {
  console.log(`karate running on port ${port}`);
});
