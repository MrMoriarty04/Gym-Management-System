const parseJsonSafely = (text) => {
  try {
    return JSON.parse(text);
  } catch (error) {
    return null;
  }
};

const buildPrompt = (userPrompt) => {
  return [
    'You are a fitness nutrition assistant.',
    'Given available ingredients, return a practical recipe and nutrition estimate.',
    'Respond ONLY as valid JSON with this shape:',
    '{',
    '  "recipeName": "string",',
    '  "ingredients": ["string"],',
    '  "instructions": ["string"],',
    '  "estimatedCalories": number,',
    '  "estimatedMacros": { "protein": number, "carbs": number, "fat": number },',
    '  "budgetTips": ["string"]',
    '}',
    '',
    `User prompt: ${userPrompt}`,
  ].join('\n');
};

const generateRecipeFromPrompt = async (userPrompt) => {
  if (!process.env.AI_API_KEY) {
    throw new Error('AI_API_KEY is not configured');
  }

  const endpoint = process.env.AI_API_URL || 'https://api.openai.com/v1/chat/completions';
  const model = process.env.AI_MODEL || 'gpt-4o-mini';

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.AI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      messages: [
        {
          role: 'system',
          content: 'You produce safe, concise, nutrition-focused recipe suggestions.',
        },
        {
          role: 'user',
          content: buildPrompt(userPrompt),
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI API request failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const rawText = data.choices && data.choices[0] && data.choices[0].message
    ? data.choices[0].message.content
    : null;

  if (!rawText) {
    throw new Error('AI API returned an empty response');
  }

  const parsed = parseJsonSafely(rawText);
  if (parsed) {
    return parsed;
  }

  return {
    recipeName: 'AI Suggested Recipe',
    ingredients: [],
    instructions: [rawText],
    estimatedCalories: null,
    estimatedMacros: { protein: null, carbs: null, fat: null },
    budgetTips: [],
  };
};

module.exports = {
  generateRecipeFromPrompt,
};
