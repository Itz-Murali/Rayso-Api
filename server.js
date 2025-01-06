import express from 'express';
import bodyParser from 'body-parser';
import RaySo, {
  CardTheme,
  CardPadding,
  CardProgrammingLanguage,
} from 'rayso-api';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/generate', async (req, res) => {
  const { code, title, theme, background, darkMode, padding, language } = req.body;

  try {
    // Create a new RaySo instance with the provided configuration
    const raySo = new RaySo({
      title: title || "Untitled-1",
      theme: theme || CardTheme.CANDY,
      background: background !== undefined ? background : true,
      darkMode: darkMode !== undefined ? darkMode : true,
      padding: padding || CardPadding.md,
      language: language || CardProgrammingLanguage.AUTO,
    });

    // Generate the image buffer
    const imageBuffer = await raySo.cook(code);
    res.setHeader('Content-Type', 'image/png');
    res.send(imageBuffer);
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to generate image" });
  }
});

app.post('/themes', (req, res) => {
  try {
    const themes = Object.values(CardTheme);
    res.json({ themes });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch themes" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
