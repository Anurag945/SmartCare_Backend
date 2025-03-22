import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();

const allowedOrigins = ["https://smart-care-frontend.vercel.app"];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());

// ✅ **Explicitly handle OPTIONS requests for `/chat`**
app.options("/chat", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "https://smart-care-frontend.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  return res.sendStatus(200); // ✅ Ensure 200 OK response
});

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message.toLowerCase();

    if (["hi", "hello", "hey", "good morning", "good afternoon", "good evening"].includes(userMessage)) {
      return res.json({ reply: "Hello! I am SmartCare Bot. How can I assist you today?" });
    }

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

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
