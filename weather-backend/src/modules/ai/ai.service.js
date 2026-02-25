import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export const askWeatherAI = async (userQuestion, weatherData, history = []) => {
  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are a helpful weather assistant. Use provided weather data and give concise, practical advice.`,
      },
      ...history,
      {
        role: "user",
        content: weatherData
          ? `Weather Data:\n${JSON.stringify(weatherData, null, 2)}\n\nQuestion: ${userQuestion}`
          : userQuestion,
      },
    ],
  });

  return completion.choices[0].message.content;
};