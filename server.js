import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
app.use(express.json());

// Proper CORS setup
app.use(cors({
  origin: "*", // Allow all origins (use specific domains in production)
  methods: ["GET", "POST"], // Allowed request methods
  allowedHeaders: ["Content-Type"], // Restrict to necessary headers
}));

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Common greetings
const greetings = ["hi", "hello", "hey", "good morning", "good afternoon", "good evening"];

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message.toLowerCase();

    // Handle greetings
    if (greetings.includes(userMessage)) {
      return res.json({ reply: "Hello! I am SmartCare Bot. How can I assist you today?" });
    }

    // Construct AI prompt without strict filtering
    const prompt = `
      You are SmartCare Bot, a friendly and helpful assistant. 
      - You specialize in healthcare but can chat about general topics as well.
      - Answer queries about hospitals, doctors, treatments, and medicines.
      - Feel free to engage in casual conversation.
      - Keep responses simple, short, and user-friendly.
      - If needed, provide the contact email: anuragraghavsinha@gmail.com.

      User: ${userMessage}
      Reply:
    `;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    console.log(reply);
    res.json({ reply });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred. Please try again." });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
