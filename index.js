const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.p0m1q4c.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();

    const carCollections = client.db("carDB").collection("cars");
    const cartCollections = client.db("carDB").collection("carts");

    app.post("/cartList", async (req, res) => {
      const newCart = req.body;
      const result = await cartCollections.insertOne(newCart);
      res.send(result);
    });
    app.get("/cartList", async (req, res) => {
      const cursor = cartCollections.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.delete("/cartList/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: id };
      const result = await cartCollections.deleteOne(query);
      res.send(result);
    });

    app.post("/brandInfo", async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await carCollections.insertOne(newProduct);
      res.send(result);
    });

    app.get("/brandInfo/:brandName", async (req, res) => {
      const name = req.params.brandName;
      const query = { brandName: name };
      const result = await carCollections.find(query).toArray();
      res.send(result);
    });
    app.get("/carDetails/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await carCollections.findOne(query);
      res.send(result);
    });

    app.put("/updateCar/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateCar = req.body;
      const car = {
        $set: {
          photo: updateCar.photo,
          name: updateCar.name,
          productType: updateCar.productType,
          brandName: updateCar.brandName,
          price: updateCar.price,
          description: updateCar.description,
          rating: updateCar.rating,
        },
      };
      const result = await carCollections.updateOne(query, car, options);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Drive Master Pro server is running");
});

app.listen(port, (req, res) => {
  console.log(port);
});
