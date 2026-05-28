import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const PORT = 3000;
const DATA_FILE = path.join(process.cwd(), "prompts.json");

// Helper to load data
function loadPrompts() {
  if (fs.existsSync(DATA_FILE)) {
    try {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(data);
    } catch (err) {
      console.error("Error reading prompts:", err);
    }
  }
  return [];
}

// Helper to save data
function savePrompts(prompts: any[]) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(prompts, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving prompts:", err);
  }
}

let prompts = loadPrompts();

async function startServer() {
  const app = express();

  app.use(express.json());

  // API Routes
  app.get("/api/prompts", (req, res) => {
    res.json(prompts);
  });

  app.post("/api/prompts", (req, res) => {
    const { name, model, promptText } = req.body;
    
    if (!name || !model || !promptText) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const newPrompt = {
      id: Date.now().toString(),
      name,
      model,
      promptText,
      createdAt: new Date().toISOString()
    };

    prompts.unshift(newPrompt); // Add to beginning
    savePrompts(prompts);
    res.status(201).json(newPrompt);
  });

  // Vite Middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // For Express 4.x use *
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
