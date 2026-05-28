export interface JailbreakPrompt {
  id: string;
  name: string;
  model: string;
  promptText: string;
  createdAt: string;
}

export const AI_MODELS = [
  "DeepSeek",
  "Claude",
  "Gemini",
  "ChatGPT",
  "Groq",
  "Other"
];
