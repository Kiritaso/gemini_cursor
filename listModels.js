// listModels.js
require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

async function listModels() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  // SDK によっては listModels() か list()
  const response = await ai.models.list();  // または listModels()
  console.log("Available models:");
  for (const model of response.models || response) {
    console.log(`- ${model.name}: ${model.description}`);
  }
}

listModels().catch(console.error);
