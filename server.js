import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
app.use(express.json());

// ✅ Configure CORS properly
app.use(
  cors({
    origin: ["http://localhost:5173", "https://smart-care-frontend.vercel.app/"], // Add your frontend URLs here
    methods: ["GET", "POST","PUT","DELETE","OPTIONS"], //

  })
);

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

    // Construct AI prompt
    const prompt = `
      You are SmartCare Bot, a friendly and helpful assistant.
      - You specialize in healthcare but can chat about general topics as well.
      - Answer queries about hospitals, doctors, treatments, and medicines.
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


