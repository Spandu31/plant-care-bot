// backend/routes/chat.js
const express = require("express");
const router = express.Router();
const axios = require("axios");

const SYSTEM_PROMPT =
  "You are a gardening expert. Only answer plant care questions. " +
  "If asked about anything else, respond with 'Information not available.'";

router.post("/", async (req, res) => {
  try {
    const apiKey = process.env.OPENAI_API_KEY; // read at request time
    if (!apiKey) {
      console.error("❌ OPENAI_API_KEY is not set in the environment");
      return res
        .status(500)
        .json({ reply: "Server is not configured properly (missing AI key)." });
    }

    const userInput = req.body.message;
    if (!userInput || typeof userInput !== "string") {
      return res.status(400).json({ reply: "Please send a valid message." });
    }

    const payload = {
      model: "llama3.2-vision:latest",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userInput },
      ],
      temperature: 0.7,
    };

    const { data } = await axios.post(
      "https://chat.ivislabs.in/api/chat/completions",
      payload,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        timeout: 15000, // avoid hanging forever
      }
    );

    let content =
      data?.choices?.[0]?.message?.content ||
      data?.choices?.[0]?.message ||
      "No response";

    // If API sends content as an array, join it
    if (Array.isArray(content)) {
      content = content.join("\n");
    }

    const cleanContent =
      typeof content === "string"
        ? content.replace(/<[^>]*>/g, "").trim()
        : "No response";

    res.json({ reply: cleanContent || "No response" });
  } catch (err) {
    console.error("AI API error:", err.response?.data || err.message);
    res.status(500).json({
      reply: "Sorry, I'm having trouble talking to the AI server right now.",
    });
  }
});

module.exports = router;
