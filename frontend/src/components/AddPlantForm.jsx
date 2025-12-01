import React, { useState } from "react";
import axios from "axios";
import WateringSlider from "./WateringSlider.jsx";
import "./AddPlantForm.css";
import { API_BASE_URL } from "../config/api"; // ✅ good

export default function AddPlantForm({ refresh, closeForm }) {
  const [form, setForm] = useState({
    name: "",
    type: "Indoor",
    wateringFrequency: 7,
    lastWateredAt: new Date().toISOString().split("T")[0],
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSliderChange = (value) => {
    setForm({ ...form, wateringFrequency: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/plants`, form); // ✅ correct
      refresh();
      closeForm();
    } catch (err) {
      console.error("Error adding plant:", err.response?.data || err.message);
    }
  };

  // JSX ... ✅
}
