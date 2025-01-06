import express from 'express';
import bodyParser from 'body-parser';
import RaySo from 'rayso-api';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const raySo = new RaySo({
  title: "Murali",
  theme: "candy",
  background: true,
  darkMode: true,
  padding: 32,
  language: "auto",
});

app.post('/generate', async (req, res) => {
  const { code, title, theme, background, darkMode, padding, language } = req.body;

  try {
    raySo.updateConfig({
      title: title || "Untitled-1",
      theme: theme || "candy",
      background: background !== undefined ? background : true,
      darkMode: darkMode !== undefined ? darkMode : true,
      padding: padding || 32,
      language: language || "auto",
    });

    const imageBuffer = await raySo.cook(code);
    res.setHeader('Content-Type', 'image/png');
    res.send(imageBuffer);
  } catch (error) {
    res.status(500).json({ error: "Failed to generate image" });
  }
});

app.post('/themes', (req, res) => {
  const themes = [
    "breeze",
    "candy",
    "crimson",
    "falcon",
    "meadow",
    "midnight",
    "raindrop",
    "sunset",
  ];
  res.json({ themes });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

