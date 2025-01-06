import express from "express";
import bodyParser from "body-parser";
import RaySo from "rayso-api";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post("/generate", async (req, res) => {
  const {
    code,
    title = "Untitled-1",
    theme = "breeze",
    background = true,
    darkMode = true,
    padding = 32,
    language = "auto",
    localPreview = false,
    localPreviewPath = "./",
    debug = false,
  } = req.body;

  if (!code || typeof code !== "string") {
    return res.status(400).json({ error: "Invalid or missing 'code' field." });
  }

  try {
    const raySo = new RaySo({
      title,
      theme,
      background,
      darkMode,
      padding,
      language,
      localPreview,
      localPreviewPath,
      debug,
    });

    const imageBuffer = await raySo.cook(code);

    if (!imageBuffer || imageBuffer.length === 0) {
      return res.status(500).json({ error: "Image generation failed. Empty buffer returned." });
    }

    res.setHeader("Content-Type", "image/png");
    res.send(imageBuffer);
  } catch (error) {
    console.error("Error generating image:", error.message || error);
    res.status(500).json({ error: error.message || "An unknown error occurred." });
  }
});

app.post("/themes", (req, res) => {
  try {
    const themes = ["breeze", "candy", "crimson", "falcon", "meadow", "midnight", "raindrop", "sunset"];
    res.json({ themes });
  } catch (error) {
    console.error("Error fetching themes:", error.message || error);
    res.status(500).json({ error: error.message || "Failed to fetch themes." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
