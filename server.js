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
                        Please provide a comprehensive app idea with the following details:
                            1. App Name (Creative and catchy)
                            2. One-line Description
                            3. Target Audience
                            4. Core Features (list 3-5 key features)
                            5. Uinque Value Proposition
                            6. Monetization Strategy
                            7. Technology Stack Suggestions

                        Format the response in a clear, structured way.
        `;

        // call OpenAI API to generate the app idea
        

    } catch (error) {
        console.error("Error generating app idea:", error);
        res.status(500).json({ error: "Failed to generate app idea" });
    }
});