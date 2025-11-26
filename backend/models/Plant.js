const mongoose = require("mongoose");

const PlantSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  name: { type: String, required: true },
  type: { type: String, enum: ['Indoor', 'Outdoor'], required: true },
  wateringFrequency: { type: Number, required: true }, // days
  lastWateredAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Plant", PlantSchema);
