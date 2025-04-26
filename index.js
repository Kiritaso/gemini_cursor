// index.js
require("dotenv").config();
const express = require("express");
const cors    = require("cors");
const { GoogleGenAI, Modality } = require("@google/genai");
const path    = require("path");

const app = express();
app.use(cors());
app.use(express.json());
// static 配信（preview.html を同一オリジンで配信）
app.use(express.static(__dirname));

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post("/api/gen-image", async (req, res) => {
  // プロンプト＋Base64画像＋MIMEタイプを受け取る
  const { prompt, imageBase64, mimeType } = req.body;

  try {
    // 1) コンテンツ配列にテキストを入れる
    const contents = [{ text: prompt }];
    // 2) 画像があれば inlineData 形式で追加
    if (imageBase64 && mimeType) {
      contents.push({ inlineData: { data: imageBase64, mimeType } });
    }
    // 3) マルチモーダルモデルへリクエスト
    const result = await ai.models.generateContent({
      model: "gemini-pro-vision",
      contents,
      config: { responseModalities: [Modality.TEXT, Modality.IMAGE] },
    });
    // 4) レスポンスからテキストと画像(Base64)を取り出す
    const parts = result.candidates[0].content.parts;
    const text   = parts.find(p => p.text)?.text;
    const outB64 = parts.find(p => p.inlineData)?.inlineData.data;

    return res.json({ text, imageBase64: outB64 });
  } catch (err) {
    console.error("Image API error:", err);
    return res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server listening on ${PORT} (branch: multimodal)`)
);