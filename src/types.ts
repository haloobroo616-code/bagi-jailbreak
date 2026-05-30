export interface JailbreakPrompt {
  id: string;
  name: string;
  model: string;
  message?: string;
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
