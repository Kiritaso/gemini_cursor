require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post("/api/gen-image", async (req, res) => {
  const { prompt } = req.body;
  try {
    const result = await ai.models.generateImages({
      model: "gemini-2.0-flash-exp-image-generation",
      prompt,
      config: { numberOfImages: 1 },
    });
    const uri = result.images[0].uri;
    return res.json({ uri });
  } catch (err) {
    console.error("Image API error:", err);
    return res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));