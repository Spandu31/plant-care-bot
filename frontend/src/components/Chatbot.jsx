// frontend/src/components/Chatbot.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api"; // 👈 import base URL

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [showPopup, setShowPopup] = useState(true);

  const [messages, setMessages] = useState([
    {
      sender: "Bot",
      text: "Welcome! How can I help you with your plants today? 🌿",
    },
  ]);

  useEffect(() => {
    if (showPopup && !open) {
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showPopup, open]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "You", text: input }];
    const currentInput = input; // preserve before clearing
    setMessages(newMessages);
    setInput("");

    try {
      const res = await axios.post(`${API_BASE_URL}/api/chat`, {
        message: currentInput,
      });

      setMessages([
        ...newMessages,
        {
          sender: "Bot",
          text: res.data.reply || "No reply from server.",
        },
      ]);
    } catch (err) {
      console.error("Chat error:", err.response?.data || err.message);
      setMessages((prev) => [
        ...prev,
        {
          sender: "Bot",
          text: "Sorry, I'm having trouble connecting to the server.",
        },
      ]);
    }
  };

  const toggleChat = () => {
    if (!open) {
      setShowPopup(false);
    }
    setOpen(!open);
  };

  return (
    <>
      {showPopup && !open && (
        <div className="chatbot-popup-cloud" onClick={toggleChat}>
          {/* you can add some teaser text here */}
        </div>
      )}

      <button className="btn btn-success chatbot-toggle" onClick={toggleChat}>
        🤖
      </button>

      {open && (
        <div className="chatbot-window card shadow-sm p-2">
          <div className="chat-messages mb-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.sender === "You" ? "text-end" : "text-start"}
              >
                <b>{m.sender}:</b> {m.text}
              </div>
            ))}
          </div>
          <div className="d-flex">
            <input
              type="text"
              className="form-control me-2"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask about plant care..."
            />
            <button className="btn btn-success" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
