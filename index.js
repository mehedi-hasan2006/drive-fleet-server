const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const port = process.env.PORT || 5000;
const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.DB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const db = client.db("drive-fleet");
    const carsCollection = db.collection("cars");

    // get all the cars
    app.get("/cars", async (req, res) => {
      const cursor = carsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //get signle car by id
    app.get("/cars/:carId", async (req, res) => {
      const { carId } = req.params;
      const query = { _id: new ObjectId(carId) };
      const result = await carsCollection.findOne(query);

      res.send(result);
    });

    //get featured cars data
    app.get("/featured", async (req, res) => {
      const cursor = carsCollection.find().limit(6);
      const result = await cursor.toArray();
      res.send(result);
    });
    
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
