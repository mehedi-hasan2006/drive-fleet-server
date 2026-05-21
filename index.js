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

// verify token midleware
const verifyToken = async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized. Verification Failed!!.." });
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
    // await client.connect();

    const db = client.db("drive-fleet");
    const carsCollection = db.collection("cars");
    const bookingsCollection = db.collection("bookings");

    // get all the cars
    app.get("/cars", async (req, res) => {
      const search = req.query.search || "";
      const type = req.query.type || "";

      const query = {};

      if (search) {
        query.name = {
          $regex: search,
          $options: "i",
        };
      }

      if (type) {
        query.carType = type;
      }

      const cars = await carsCollection.find(query).toArray();
      res.send(cars);
    });

    //get signle car by id
    app.get("/cars/:carId", verifyToken, async (req, res) => {
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

    // get api for accessing booking data from ui
    app.get("/bookings/:userId", verifyToken, async (req, res) => {
      const { userId } = req.params;
      const result = await bookingsCollection
        .find({ userId: userId })
        .toArray();

      res.send(result);
    });

    // api for store data from add car page
    app.post("/cars", verifyToken, async (req, res) => {
      const carData = req.body;
      const result = carsCollection.insertOne(carData);
      res.json(result);
    });

    // get api for accessing added car data from client
    app.get("/cars/my-added-cars/:userId", verifyToken, async (req, res) => {
      const { userId } = req.params;
      const result = await carsCollection.find({ userId: userId }).toArray();
      res.send(result);
    });

    // delete api for my added car data
    app.delete("/cars/my-added-cars/:carId", verifyToken, async (req, res) => {
      const { carId } = req.params;
      const result = await carsCollection.deleteOne({
        _id: new ObjectId(carId),
      });
      res.json(result);
    });

    // api for update car data
    app.patch("/cars/my-added-cars/:carId", verifyToken, async (req, res) => {
      const { carId } = req.params;
      const filter = {
        _id: new ObjectId(carId),
      };
      const modifiedCar = req.body;
      const updatedData = {
        $set: {
          name: modifiedCar.name,
          dailyRentPrice: modifiedCar.dailyRentPrice,
          carType: modifiedCar.carType,
          image: modifiedCar.image,
          seatCapacity: modifiedCar.seatCapacity,
          pickupLocation: modifiedCar.pickupLocation,
          description: modifiedCar.description,
          availabilityStatus: modifiedCar.availabilityStatus,
        },
      };
      const result = await carsCollection.updateOne(filter, updatedData);

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
