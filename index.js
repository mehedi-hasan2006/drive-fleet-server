const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { createRemoteJWKSet, jwtVerify } = require("jose-cjs");
const port = process.env.PORT || 5000;
const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());

// midlware function
const midlwareFunc = (req, res, next) => {
  next();
};

// verify token midleware
const verifyToken = async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const JWKS = createRemoteJWKSet(
      new URL(`${process.env.CLIENT_URL}/api/auth/jwks`),
    );
    const { payload } = await jwtVerify(token, JWKS);
    req.user = payload;
    next();
  } catch (error) {
    console.error("Token validation failed:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

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
    const bookingsCollection = db.collection("bookings");

    // get all the cars
    app.get("/cars", async (req, res) => {
      const { search } = req.query;

      let cursor;

      if (search) {
        cursor = carsCollection.find({ title: search });
      } else {
        cursor = carsCollection.find();
      }

      const result = await cursor.toArray();
      res.send(result);
    });

    //get signle car by id
    app.get("/cars/:carId", midlwareFunc, verifyToken, async (req, res) => {
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

    //booking system for store data
    app.patch("/bookings/:carId", verifyToken, async (req, res) => {
      const { carId } = req.params;
      const bookings = req.body;

      const cars = await carsCollection.findOne({ _id: new ObjectId(carId) });

      if (!cars) {
        res.status(404).json({ message: "Car Not Found!" });
      }

      await carsCollection.updateOne(
        { _id: new ObjectId(carId) },
        {
          $inc: { bookingsCount: 1 },
          $set: {
            lastBookingAt: new Date(),
          },
        },
      );

      const result = await bookingsCollection.insertOne({
        ...bookings,
        bookingAt: new Date(),
      });

      res.send(result);
    });

    // get api for accessing booking data from client
    app.get("/bookings/:userId", verifyToken, async (req, res) => {
      const { userId } = req.params;
      const result = await bookingsCollection
        .find({ userId: userId })
        .toArray();

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
