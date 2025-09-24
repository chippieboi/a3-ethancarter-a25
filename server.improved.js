require("dotenv").config()
const express = require("express");
const path = require("path");
const mime = require("mime");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 3000;

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.DATABASE_URL;
const { SECRET  = "secret" } = process.env;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


app.use(express.json());
app.use(express.static("public"));

let carsCollection;
let users;

let appdata = [
  { model: "toyota", year: 1999, mpg: 23, derivedPrice: 23023 },
  { model: "honda", year: 2004, mpg: 30, derivedPrice: 29880 },
  { model: "ford", year: 1987, mpg: 14, derivedPrice: 14182 },
];

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    //console.log("Pinged your deployment. You successfully connected to MongoDB!");
    const db = client.db("a3db"); 
    carsCollection = db.collection("cars");
    users = db.collection("users");
    console.log("connected to mongodb");
  } catch(err){
    console.error("something failed: ", err);
  }
}
run().catch(console.dir);

//gets
app.get("/index", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
})


app.get("/data", authMiddleware, async (req, res) => {
  try{
    const cars = await carsCollection.find({username: req.user.username}).toArray();
    res.json(cars);
  } catch (err){
    res.status(400).send("data issue" + err.message);
  }
});

//posts
app.post("/submit", authMiddleware, async (req, res) => {
  try{
    const newData = req.body;
    newData.derivedPrice = calculateDerivedPrice(newData.year, newData.mpg);

    newData.username = req.user.username;

    await carsCollection.insertOne(newData);
    const cars = await carsCollection.find({username: req.user.username}).toArray();
    res.json(cars);
  }catch (err){
    res.status(400).send(err.message);
  }
  
});

app.post("/modify", authMiddleware, async (req, res) => {
  try {
    const { id, updatedEntry } = req.body;

    updatedEntry.derivedPrice = calculateDerivedPrice(updatedEntry.year, updatedEntry.mpg);

    await carsCollection.updateOne(
      {_id: ObjectId.createFromHexString(id)},
      { $set: updatedEntry}
    );

    const cars = await carsCollection.find({username: req.user.username}).toArray();
    res.json(cars);
  } catch (err) {
    res.status(400).send("Not good index");
  }
  
});

app.post("/delete", authMiddleware, async (req, res) => {
  try{
    const { id } = req.body;

    await carsCollection.deleteOne({_id: ObjectId.createFromHexString(id)});

    const cars = await carsCollection.find({username: req.user.username}).toArray();
    res.json(cars);
  } catch (err) {
    res.status(400).send("Not good index");
  }
  
});

function calculateDerivedPrice(year, mpg) {
  return (3000 - year) * mpg;
}

//user shenanigans
app.post("/login", async (req, res) => {
  try{
    let user = await users.findOne({username: req.body.username});

    if(user) {

      const result = await bcrypt.compare(req.body.password, user.password);

      if (result) {
        const token = await jwt.sign({username: user.username}, SECRET);
        res.json({token})
      } else{
        res.status(400).send("incorrect password");
      }
    } else{
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = {username: req.body.username, password: hashedPassword};

      const result = await users.insertOne(newUser);
      user = {_id: result.insertedId, username: req.body.username};

      const token = jwt.sign({username: user.username}, SECRET);
      res.json({ token });
    }
      
  } catch (err){
    res.status(400).send(err.message);
  }
});

//token valification
function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(400).send("missing auth header");
  }

  const token = authHeader.split(" ")[1];
  //console.log(token);
  if (!token || token === "null") {
    //console.log("null or !token triggered");
    return res.status(400).send("missing token");
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(400).send("invalid token");
  }
}

//start
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
