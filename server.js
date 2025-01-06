import express from "express";
import bodyParser from "body-parser";
import RaySo, {
  CardTheme,
  CardPadding,
  CardProgrammingLanguage,
} from "rayso-api";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post("/generate", async (req, res) => {
  const { code, title, theme, background, darkMode, padding, language } = req.body;

  if (!code || typeof code !== "string") {
    return res.status(400).json({ error: "Invalid or missing 'code' field." });
  }

  try {
    const raySo = new RaySo({
      title: title || "Untitled-1",
      theme: theme || CardTheme.CANDY,
      background: background !== undefined ? background : true,
      darkMode: darkMode !== undefined ? darkMode : true,
      padding: padding || CardPadding.md,
      language: language || CardProgrammingLanguage.AUTO,
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
    const themes = Object.values(CardTheme);
    res.json({ themes });
  } catch (error) {
    console.error("Error fetching themes:", error.message || error);
    res.status(500).json({ error: error.message || "Failed to fetch themes." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
