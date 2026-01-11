const XP_KEY = "xp-data";

export function getXPData() {
  const saved = localStorage.getItem(XP_KEY);
  if (saved) return JSON.parse(saved);

  const init = { xp: 0, level: "Beginner" };
  localStorage.setItem(XP_KEY, JSON.stringify(init));
  return init;
}

export function addXP(amount) {
  const data = getXPData();
  data.xp += amount;
  data.level = getLevel(data.xp);
  localStorage.setItem(XP_KEY, JSON.stringify(data));
  return data;
}

export function getLevel(xp) {
  if (xp >= 600) return "Job-Ready 🚀";
  if (xp >= 300) return "Advanced 💪";
  if (xp >= 100) return "Intermediate 🌱";
  return "Beginner 🐣";
}
