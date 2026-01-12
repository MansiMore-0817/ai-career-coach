import OpenAI from "openai";

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // browser use ONLY during dev
});

const USE_MOCK = true; // turn OFF when limits reset

export async function analyzeResume(text, role = "MERN Developer") {
  const prompt = `
You are an experienced technical recruiter.

Your task:
Evaluate the resume STRICTLY for the role: ${role}

Scoring rules (VERY IMPORTANT):
- Score MUST be based ONLY on skills relevant to the selected role
- If resume is mostly unrelated to the role, score should be LOW (1–4)
- General programming skills should NOT result in a high score for specialized roles
- Do NOT be generous

Return STRICT JSON in this format:
{
  "score": number (1 to 10),
  "skillsFound": [string],
  "skillsMissing": [string],
  "suggestions": [string]
}

Guidelines:
- skillsFound = only skills relevant to ${role}
- skillsMissing = important role-specific skills not found
- suggestions = practical steps to move towards ${role}

No explanations.
No markdown.
No emojis.

Resume text:
${text}
  `;

  if (USE_MOCK) {
    return {
      score: 4,
      skillsFound: ["JavaScript", "React"],
      skillsMissing: ["Networking", "Linux", "Cybersecurity Fundamentals"],
      suggestions: [
        "Learn cybersecurity basics before switching roles",
        "Practice labs on TryHackMe or Hack The Box",
        "Add a security-focused project",
      ],
    };
  }

  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return JSON.parse(response.choices[0].message.content);
}

export async function rewriteBullet(bullet, role) {
  const prompt = `
You are a resume expert.

Rewrite the following resume bullet for the role: ${role}

Rules:
- Keep it ONE bullet
- Make it impactful and role-relevant
- Use action verbs
- Add clarity and professionalism
- Do NOT exaggerate
- No emojis
- No markdown

Bullet:
"${bullet}"
`;

  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content.trim();
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
