export function getOrUpdateStreak() {
  const today = new Date().toDateString();        // "Mon Jan 12 2026"
  const saved = localStorage.getItem("streak-data");

  if (!saved) {
    const initial = {
      streak: 1,
      lastDate: today,
    };
    localStorage.setItem("streak-data", JSON.stringify(initial));
    return initial;
  }

  const data = JSON.parse(saved);

  if (data.lastDate === today) {
    return data;                                  // already counted today
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (data.lastDate === yesterday.toDateString()) {
    data.streak += 1;                              // continue streak
  } else {
    data.streak = 1;                               // streak broken
  }

  data.lastDate = today;
  localStorage.setItem("streak-data", JSON.stringify(data));
  return data;
}
