require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const Role = require("./models/role.js");
const Experience = require("./models/experience.js");
const AddsOn = require("./models/adds-on.js");
const Salaries = require("./models/salary.js");
const Plan = require("./models/plan.js");

app.use(
  cors({
    origin: "https://batamon-global-group.webflow.io",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// const corsMiddleware = (req, res, next) => {
//   res.setHeader("X-Custom-Header", "Hello from the server!");
//   res.setHeader("Access-Control-Allow-Methods", "GET,PATCH,DELETE,POST,PUT");
//   res.append("Access-Control-Allow-Headers", "Content-Type");
//   res.setHeader("Access-Control-Allow-Credentials", true);
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
//   );
//   next();
// };
// app.use(corsMiddleware);

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

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

app.get("/roles/search", async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      const roles = await Role.find();
      res.send(roles);
    } else {
      const query = { role_name: { $regex: keyword, $options: "i" } };
      const results = await Role.find(query);

      res.send(results);
    }
  } catch (error) {
    res.status(500).send({ error: "Internal server error" });
  }
});

app.put("/roles/:id", async (req, res) => {
  try {
    const result = await Role.replaceOne({ _id: req.params.id }, req.body);
    res.status(200).send("Role updated.");
  } catch (error) {
    res.status(500).send("Error updating role.");
  }
});

app.delete("/roles/:id", async (req, res) => {
  try {
    const result = await Role.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 1) {
      res.status(200).send("Role deleted.");
    } else {
      res.status(404).send("Role not found.");
    }
  } catch (error) {
    res.status(500).send("Error deleting role.");
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

app.put("/experience/:id", async (req, res) => {
  try {
    const result = await Experience.replaceOne(
      { _id: req.params.id },
      req.body
    );
    res.status(200).send("Experience updated.");
  } catch (error) {
    res.status(500).send("Error updating experience.");
  }
});

app.delete("/experience/:id", async (req, res) => {
  try {
    const result = await Experience.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 1) {
      res.status(200).send("Experience deleted.");
    } else {
      res.status(404).send("Experience not found.");
    }
  } catch (error) {
    res.status(500).send("Error deleting experience.");
  }
});

app.get("/experience/search", async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      const years_of_experience = await Experience.find();
      res.send(years_of_experience);
    } else {
      const query = { years_of_experience: { $regex: keyword, $options: "i" } };
      const results = await Experience.find(query);

      res.send(results);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/salary", async (req, res) => {
  try {
    const salaries = await Salaries.find();
    res.send(salaries);
  } catch (error) {
    res.status(500).send("Error fetching salary from the database.");
  }
});

app.get("/salary/:role_id/:experience_id", async (req, res) => {
  try {
    const role_id = req.params.role_id;
    const experience_id = req.params.experience_id;

    const salary = await Salaries.findOne({
      role_id: role_id,
      experience_id: experience_id,
    });

    if (!salary) {
      return res.status(404).send("Salary data not found.");
    }

    res.status(200).json(salary);
  } catch (error) {
    res.status(500).send("Error fetching salary from the database.");
  }
});

app.post("/salary", async (req, res) => {
  try {
    const newSalary = new Salaries({
      role_id: req.body.role_id,
      experience_id: req.body.experience_id,
      batam_salary: req.body.batam_salary,
      sg_salary: req.body.sg_salary,
    });
    await newSalary.save();
    res.status(201).send("Salary created successfully.");
  } catch (error) {
    console.error("Error creating salary:", error);
    res.status(500).send("Error creating salary.");
  }
});

app.patch("/salary/:id", async (req, res) => {
  try {
    const salaryId = req.params.id;

    const existingSalary = await Salaries.findById(salaryId);
    if (!existingSalary) {
      return res.status(404).send("Salary not found.");
    }

    if (req.body.batam_salary !== undefined) {
      existingSalary.batam_salary = req.body.batam_salary;
    }
    if (req.body.sg_salary !== undefined) {
      existingSalary.sg_salary = req.body.sg_salary;
    }

    // Save the updated salary record
    await existingSalary.save();

    res.status(200).send("Salary updated successfully.");
  } catch (error) {
    console.error("Error updating salary:", error);
    res.status(500).send("Error updating salary.");
  }
});

app.delete("/salary/:id", async (req, res) => {
  try {
    const salaryId = req.params.id;

    const result = await Salaries.deleteOne(salaryId);

    if (result.deletedCount === 1) {
      res.status(200).send("Salary deleted successfully.");
    } else {
      res.status(404).send("Salary not found.");
    }
  } catch (error) {
    console.error("Error deleting salary:", error);
    res.status(500).send("Error deleting salary.");
  }
});

app.post("/salaries", async (req, res) => {
  try {
    const salaryDataArray = req.body;

    const createdSalaries = await Salaries.insertMany(salaryDataArray);
    res.status(201).json(createdSalaries);
  } catch (error) {
    console.error("Error creating salaries:", error);
    res.status(500).send("Error creating salaries.");
  }
});

// app.get("/adds-on", async (req, res) => {
//   let addsOnIds = req.query["adds-on"];
//   try {
//     if (typeof addsOnIds == "string") {
//       const addsOn = await AddsOn.findById(addsOnIds);
//       res.send(addsOn);
//     } else {
//       const selectedAddsOn = [];
//       for (id of addsOnIds) {
//         const addsOn = await AddsOn.findById(id);
//         selectedAddsOn.push(addsOn);
//       }
//       res.send(selectedAddsOn);
//     }
//   } catch (error) {
//     res.status(500).send("Error fetching adds-on from the database.");
//   }
// });

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

app.put("/adds-on/:id", async (req, res) => {
  try {
    const result = await AddsOn.replaceOne({ _id: req.params.id }, req.body);
    res.status(200).send("Adds-on updated.");
  } catch (error) {
    res.status(500).send("Error creating adds-on.");
  }
});

app.delete("/adds-on/:id", async (req, res) => {
  try {
    const result = await AddsOn.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 1) {
      res.status(200).send("Adds-on deleted.");
    } else {
      res.status(404).send("Adds-on not found.");
    }
  } catch (error) {
    res.status(500).send("Error deleting adds-on.");
  }
});

app.get("/plan", async (req, res) => {
  try {
    const plan = await Plan.find();
    res.send(plan);
  } catch (error) {
    res.status(500).send("Error fetching adds-on from the database.");
  }
});

app.post("/plan", async (req, res) => {
  const {
    plan_name,
    coworking_desk_price,
    talent_sourcing_percentage,
    other_benefits_percentage,
  } = req.body;
  try {
    const newPlan = new Plan({
      plan_name,
      coworking_desk_price,
      talent_sourcing_percentage,
      other_benefits_percentage,
    });
    await newPlan.save();
    res.status(201).send("New plan created successfully.");
  } catch (error) {
    res.status(500).send("Error creating a new plan.");
  }
});

app.put("/plan/:id", async (req, res) => {
  try {
    const result = await Plan.replaceOne({ _id: req.params.id }, req.body);
    res.status(200).send("Plan updated.");
  } catch (error) {
    res.status(500).send("Error creating plan.");
  }
});

app.delete("/plan/:id", async (req, res) => {
  try {
    const result = await Plan.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 1) {
      res.status(200).send("Plan deleted.");
    } else {
      res.status(404).send("Plan not found.");
    }
  } catch (error) {
    res.status(500).send("Error deleting Plan.");
  }
});

app.get("/total", async (req, res) => {
  const { total_salary, plan_id: planId, adds_on: addsOnIds } = req.query;
  try {
    let selectedAddsOn = [];
    let selectedAddsOnPrice = 0;
    if (typeof addsOnIds == "string") {
      selectedAddsOn = await AddsOn.findById(addsOnIds);
      selectedAddsOnPrice = selectedAddsOn.addson_price;
    } else {
      for (id of Array.from(new Set(addsOnIds))) {
        selectedAddsOn = await AddsOn.findById(id);
        selectedAddsOnPrice += selectedAddsOn.addson_price;
      }
    }

    const plan = await Plan.findById(planId);
    const totalSalary = Number(total_salary);
    const planNoTalentSourcing =
      totalSalary +
      plan.coworking_desk_price +
      (totalSalary * plan.other_benefits_percentage) / 100;
    const totalPlan =
      planNoTalentSourcing +
      (totalSalary * plan.talent_sourcing_percentage) / 100;

    const totalPrice = {
      plan_no_talent_sourcing: planNoTalentSourcing,
      plan_price: totalPlan,
      adds_on_price: selectedAddsOnPrice,
    };

    res.send(totalPrice);
  } catch (error) {
    res.status(500).send("Error fetching adds-on from the database.");
  }
});

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

module.exports = app;
