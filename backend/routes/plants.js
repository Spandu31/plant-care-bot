const express = require("express");
const Plant = require("../models/Plant");
const auth = require("../middleware/auth");
const router = express.Router();

// 🔹 Create a new plant
router.post("/", auth, async (req, res) => {
  try {
    const { name, type, wateringFrequency, lastWateredAt } = req.body;
    const newPlant = new Plant({
      name,
      type,
      wateringFrequency,
      lastWateredAt: lastWateredAt || Date.now(), // default to now if not provided
      user: req.user.id // Add user from auth middleware
    });
    await newPlant.save();
    res.status(201).json(newPlant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Get all plants for the logged in user
router.get("/", auth, async (req, res) => {
  try {
    const plants = await Plant.find({ user: req.user.id });
    res.json(plants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Update plant (generic)
router.put("/:id", auth, async (req, res) => {
  try {
    let plant = await Plant.findById(req.params.id);
    if (!plant) return res.status(404).json({ error: "Plant not found" });

    // Make sure user owns plant
    if (plant.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    const updatedPlant = await Plant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedPlant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Water plant (update lastWateredAt to today)
router.put("/water/:id", auth, async (req, res) => {
  try {
    let plant = await Plant.findById(req.params.id);
    if (!plant) return res.status(404).json({ error: "Plant not found" });

    // Make sure user owns plant
    if (plant.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    const today = new Date();
    const wateredPlant = await Plant.findByIdAndUpdate(
      req.params.id,
      { lastWateredAt: today },
      { new: true }
    );
    res.json(wateredPlant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Delete plant
router.delete("/:id", auth, async (req, res) => {
  try {
    let plant = await Plant.findById(req.params.id);
    if (!plant) return res.status(404).json({ error: "Plant not found" });

    // Make sure user owns plant
    if (plant.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await Plant.findByIdAndDelete(req.params.id);
    res.json({ message: "Plant deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
