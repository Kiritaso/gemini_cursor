const fetch = require("node-fetch");

async function testImageGeneration() {
  try {
    const response = await fetch("http://localhost:3000/api/gen-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: "make me a picture of batman",
      }),
    });

    const data = await response.json();
    console.log("Response:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

testImageGeneration();