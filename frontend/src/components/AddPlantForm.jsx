import React, { useState } from "react";
import axios from "axios";
import WateringSlider from "./WateringSlider.jsx";
import "./AddPlantForm.css";
import { API_BASE_URL } from "../config/api";

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
      await axios.post(`${API_BASE_URL}/api/plants`, form);
      refresh();   // reload plant list
      closeForm(); // close the form modal/section
    } catch (err) {
      console.error("Error adding plant:", err.response?.data || err.message);
    }
  };

  return (
    <form className="add-plant-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <input
          type="text"
          name="name"
          placeholder="Plant Name (e.g., Fern)"
          value={form.name}
          onChange={handleChange}
          required
        />
        <select
  name="type"
          value={form.type}
          onChange={handleChange}
          className="dropdown-select"   // ✅ THIS IS REQUIRED
          required
        >

          <option value="Indoor">Indoor</option>
          <option value="Outdoor">Outdoor</option>
        </select>
      </div>

      <div className="form-row">
        <label>Last Watered On:</label>
        <input
          type="date"
          name="lastWateredAt"
          value={form.lastWateredAt}
          onChange={handleChange}
          max={new Date().toISOString().split("T")[0]}
          required
        />
      </div>

      <WateringSlider
        value={form.wateringFrequency}
        onChange={handleSliderChange}
      />

      <button type="submit" className="submit-btn">
        Add Plant
      </button>
    </form>
  );
}
