import OpenAI from "openai";

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // browser use ONLY during dev
});

export async function analyzeResume(text) {
  const prompt = `
You are a career expert. Analyze the following resume text and provide:
1. ATS score (0-100)
2. Missing key skills
3. 3 actionable improvement suggestions
Respond in JSON ONLY:
{ "score": number, "skills": [], "suggestions": [] }

Resume:
${text}
  `;

  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return JSON.parse(response.choices[0].message.content);
}

export async function chatReply(messageHistory) {
  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: messageHistory.map((m) => ({
      role: m.role,
      content: m.text,
    })),
  });

  return response.choices[0].message.content;
}

export async function generateRoadmap(role = "mern", week = 1) {
  const prompt = `
You are a senior tech mentor.
Generate a weekly roadmap with 4-6 action items.
User learning path: ${role}.
Return weekly tasks for that learning track.

Week number: ${week}

Return response ONLY in JSON:
[
  { "text": "...task...", "done": false }
]
  `;

  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: prompt }],
  });

  const raw = JSON.parse(response.choices[0].message.content);

  // Attach unique IDs
  return raw.map((t, i) => ({
    id: Date.now() + i,
    text: t.text,
    done: false,
  }));
}
