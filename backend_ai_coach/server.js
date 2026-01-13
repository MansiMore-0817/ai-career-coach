import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import debugRoutes from "./src/routes/debug.routes.js";
import express from "express";

// Increase the default max listeners to prevent potential memory leak warnings in event emitter in tesseract.js OCR
import { EventEmitter } from "events";
EventEmitter.defaultMaxListeners = 20;




const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/debug", debugRoutes);

console.log("OPENAI_API_KEY loaded:", process.env.OPENAI_API_KEY ? "YES" : "NO");
console.log("MONGO_URI loaded:", process.env.MONGO_URI ? "YES" : "NO");

import app from "./src/app.js";
import connectDB from "./src/config/db.js";

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
