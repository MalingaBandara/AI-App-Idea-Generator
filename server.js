import express from "express";
import OpenAI from "openai";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const __filename = fileURLToPath(import.meta.url); // Get the current file path
const __dirname = path.dirname(__filename); //  Get the current directory path

const app = express();
const port = process.env.PORT || 3000;


// Authenticate with OpenAI API
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


// Pass incoming JSON data to the request body
app.use(express.json());


// ========= Routes =========

// Route: Generate App Idea
app.post("/generate", async (req, res) => {
    try {
        
        // Extract the custom prompt from the request body
        const { customPrompt } = req.body;

        // validations
        if (!customPrompt || customPrompt.trim() === "") {
            return res.status(400).json({ 
                success: false,
                error: "Custom prompt is required" 
            });
        }

        // Build the complete prompt by adding the structure instructions to user's input
        const prompt = `${customPrompt}
                        
        `;

    } catch (error) {
        console.error("Error generating app idea:", error);
        res.status(500).json({ error: "Failed to generate app idea" });
    }
});