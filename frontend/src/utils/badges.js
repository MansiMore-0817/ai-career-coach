const BADGE_KEY = "earned-badges";

export const ALL_BADGES = [
  {
    id: "first-roadmap",
    title: "First Roadmap",
    description: "Generated your first roadmap",
    icon: "🗺️",
  },
  {
    id: "task-7",
    title: "Getting Started",
    description: "Completed 7 tasks",
    icon: "✅",
  },
  {
    id: "first-week",
    title: "Week Winner",
    description: "Completed your first week",
    icon: "🏁",
  },
  {
    id: "program-complete",
    title: "Program Finisher",
    description: "Completed all 4 weeks",
    icon: "🎓",
  },
];

export function getBadges() {
  const saved = localStorage.getItem(BADGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

export function earnBadge(badgeId) {
  const earned = getBadges();
  if (earned.includes(badgeId)) return;

  const updated = [...earned, badgeId];
  localStorage.setItem(BADGE_KEY, JSON.stringify(updated));
}
