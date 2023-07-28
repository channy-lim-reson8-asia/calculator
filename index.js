const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const Role = require("./models/role.js");
const Experience = require("./models/experience.js");
const AddsOn = require("./models/adds-on.js");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const corsMiddleware = (req, res, next) => {
  res.append("Access-Control-Allow-Origin", "*");
  res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.append("Access-Control-Allow-Headers", "Content-Type");
  next();
};
app.use(corsMiddleware);

mongoose
  .connect(
    "mongodb+srv://channylim:Doraemon@calculator.dsxzntd.mongodb.net/cost-overview?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const redirectToHome = (req, res) => {
  res.redirect(307, "https://www.batamon.asia");
};

app.get("/employer", (req, res) => {
  res.redirect(307, "https://www.batamon.asia/");
});
app.get("/employee", redirectToHome);

app.get("/roles", async (req, res) => {
  try {
    const roles = await Role.find();
    res.send(roles);
  } catch (error) {
    res.status(500).send("Error fetching roles from the database.");
  }
});

app.post("/roles", async (req, res) => {
  try {
    const { role_name } = req.body;
    if (!role_name) {
      return res.status(400).send("Role name is required.");
    }
    const newRole = new Role({ role_name });
    await newRole.save();
    res.status(201).send("Role created successfully.");
  } catch (error) {
    console.error("Error creating role:", error);
    res.status(500).send("Error creating role.");
  }
});

app.get("/experience", async (req, res) => {
  try {
    const experiences = await Experience.find();
    res.send(experiences);
  } catch (error) {
    res.status(500).send("Error fetching experiences from the database.");
  }
});

app.post("/experience", async (req, res) => {
  try {
    const newExperience = new Experience({
      years_of_experience: req.body.years_of_experience,
    });
    await newExperience.save();
    res.status(201).send("Experience created successfully.");
  } catch (error) {
    res.status(500).send("Error creating experience.");
  }
});

app.get("/adds-on", async (req, res) => {
  try {
    const addsOn = await AddsOn.find();
    res.send(addsOn);
  } catch (error) {
    res.status(500).send("Error fetching adds-on from the database.");
  }
});

app.post("/adds-on", async (req, res) => {
  try {
    const newAddsOn = new AddsOn({
      addson_name: req.body.addson_name,
      addson_price: req.body.addson_price,
    });
    await newAddsOn.save();
    res.status(201).send("Adds-on created successfully.");
  } catch (error) {
    res.status(500).send("Error creating adds-on.");
  }
});

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

module.exports = app;
