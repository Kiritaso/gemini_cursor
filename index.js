require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenAI, Modality } = require("@google/genai");

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post("/api/gen-image", async (req, res) => {
  const { prompt } = req.body;
  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp-image-generation",
      contents: [{ text: prompt }],
      config: { responseModalities: [Modality.TEXT, Modality.IMAGE] },
    });
    const parts = result.candidates[0].content.parts;
    // テキスト部分と Base64 画像データを抜き出し
    const text = parts.find(p => p.text)?.text;
    const imageBase64 = parts.find(p => p.inlineData)?.inlineData.data;
    return res.json({ text, imageBase64 });

  } catch (err) {
    console.error("Image API error:", err);
    return res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));