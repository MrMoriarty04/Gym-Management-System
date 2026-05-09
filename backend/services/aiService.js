require("dotenv").config();

const parseJsonSafely = (text) => {
  try {
    return JSON.parse(text);
  } catch (error) {
    return null;
  }
};

const buildMealPrompt = (mealText) => {
  return [
    "You are a fitness nutrition assistant.",
    "Given a text describing what a user ate, estimate the calories and macronutrients.",
    "Respond ONLY as valid JSON with this exact shape:",
    "{",
    '  "mealName": "string",',
    '  "ingredients": "string",',
    '  "calories": number,',
    '  "protein": number,',
    '  "carbs": number,',
    '  "fat": number',
    "}",
    "",
    `User ate: ${mealText}`,
  ].join("\n");
};

const buildChatPrompt = (message, history = []) => {
  const transcript = history
    .filter((entry) => entry && entry.role && entry.content)
    .slice(-8)
    .map((entry) => `${entry.role.toUpperCase()}: ${entry.content}`)
    .join("\n");

  return [
    "You are an elite fitness coach and gym operations assistant.",
    "Give concise, actionable answers for training, nutrition, recovery, and gym habits.",
    "If the user asks about medical or injury concerns, advise them to consult a professional.",
    "Respond in plain text only. Do not use markdown tables.",
    "",
    transcript
      ? `Conversation so far:\n${transcript}`
      : "Conversation so far: none.",
    `User: ${message}`,
  ].join("\n");
};

const analyzeMealLog = async (mealText) => {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) throw new Error("GROQ_API_KEY is not configured in .env");

  const endpoint = "https://api.groq.com/openai/v1/chat/completions";
  const model = "llama-3.1-8b-instant";

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model,
      temperature: 0.1,
      messages: [
        {
          role: "system",
          content:
            "You are a precise nutrition calculator. You output ONLY valid JSON without any markdown formatting.",
        },
        { role: "user", content: buildMealPrompt(mealText) },
      ],
    }),
  });

  if (!response.ok)
    throw new Error(`Groq API request failed: ${await response.text()}`);

  const data = await response.json();
  let rawText = data.choices?.[0]?.message?.content || null;

  if (!rawText) throw new Error("Groq returned an empty response");

  rawText = rawText
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return parseJsonSafely(rawText);
};

const chatWithCoach = async ({ message, history = [] }) => {
  if (!message || !String(message).trim()) {
    throw new Error("Message is required");
  }

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return [
      "I can help with training, nutrition, recovery, and gym planning.",
      "Set GROQ_API_KEY in the backend environment to enable live AI replies.",
    ].join(" ");
  }

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content:
              "You are a precise fitness coach. Keep answers practical, direct, and under 180 words unless the user asks for a plan.",
          },
          { role: "user", content: buildChatPrompt(message, history) },
        ],
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Groq API request failed: ${await response.text()}`);
  }

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content?.trim();

  if (!reply) {
    throw new Error("Groq returned an empty response");
  }

  return reply.replace(/```/g, "").trim();
};

const generateRecipeFromPrompt = async () => {
  return {};
};

module.exports = {
  generateRecipeFromPrompt,
  analyzeMealLog,
  chatWithCoach,
};
