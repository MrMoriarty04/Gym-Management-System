require('dotenv').config();

const parseJsonSafely = (text) => {
  try {
    return JSON.parse(text);
  } catch (error) {
    return null;
  }
};

const buildMealPrompt = (mealText) => {
  return [
    'You are a fitness nutrition assistant.',
    'Given a text describing what a user ate, estimate the calories and macronutrients.',
    'Respond ONLY as valid JSON with this exact shape:',
    '{',
    '  "mealName": "string",',
    '  "ingredients": "string",',
    '  "calories": number,',
    '  "protein": number,',
    '  "carbs": number,',
    '  "fat": number',
    '}',
    '',
    `User ate: ${mealText}`,
  ].join('\n');
};

const analyzeMealLog = async (mealText) => {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) throw new Error('GROQ_API_KEY is not configured in .env');

  const endpoint = 'https://api.groq.com/openai/v1/chat/completions';
  const model = 'llama-3.1-8b-instant'; 

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      temperature: 0.1, 
      messages: [
        { role: 'system', content: 'You are a precise nutrition calculator. You output ONLY valid JSON without any markdown formatting.' },
        { role: 'user', content: buildMealPrompt(mealText) },
      ],
    }),
  });

  if (!response.ok) throw new Error(`Groq API request failed: ${await response.text()}`);

  const data = await response.json();
  let rawText = data.choices?.[0]?.message?.content || null;

  if (!rawText) throw new Error('Groq returned an empty response');

  rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

  return parseJsonSafely(rawText);
};

const generateRecipeFromPrompt = async () => {
  return {}; 
};

module.exports = {
  generateRecipeFromPrompt,
  analyzeMealLog,
};