import { useEffect, useState } from "react";
import { getOrUpdateStreak } from "../utils/streak";
import StatCard from "../components/Statcard";
import { getXPData } from "../utils/xp";
import { ALL_BADGES, getBadges } from "../utils/badges";

export default function Dashboard() {
  const [streak, setStreak] = useState(1);
  const [xpData, setXpData] = useState({ xp: 0, level: "Beginner 🐣" });
  const [earnedBadges, setEarnedBadges] = useState([]);

  useEffect(() => {
    const data = getOrUpdateStreak();
    setStreak(data.streak);
  }, []);

  useEffect(() => {
    setXpData(getXPData());
  }, []);

  useEffect(() => {
    setEarnedBadges(getBadges());
  }, []);

  return (
    <main className="overflow-y-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Welcome back, Alex! 👋</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Daily Streak" value={`${streak} days`} />
        <StatCard title="XP" value={`${xpData.xp}`} />
        <StatCard title="Level" value={xpData.level} />

        <StatCard title="Tasks Done" value="24/40" />
        <StatCard title="Progress" value="60%" />
        <StatCard title="Time Spent" value="18.5 hrs" />
      </div>

      {/* Badges Section */}
      <div className="bg-white p-6 rounded-lg border shadow-sm mt-6">
        <h3 className="font-semibold mb-4">🏅 Badges</h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {ALL_BADGES.map((badge) => {
            const earned = earnedBadges.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-lg border text-center transition ${
                  earned
                    ? "bg-green-50 border-green-300"
                    : "bg-gray-100 border-gray-200 opacity-50"
                }`}
              >
                <div className="text-2xl mb-2">{badge.icon}</div>

                <p className="text-sm font-medium">{badge.title}</p>

                <p className="text-xs text-gray-500">{badge.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress Section */}
      <div className="bg-white p-5 rounded-lg shadow-sm border mb-6">
        <h3 className="font-semibold mb-3">Learning Progress</h3>

        <Progress label="Resume Building" percent="75" />
        <Progress label="Interview Skills" percent="45" />
        <Progress label="Technical Foundation" percent="60" />
        <Progress label="Networking & Outreach" percent="30" />
      </div>
    </main>
  );
}

// Small inline Progress Component
function Progress({ label, percent }) {
  return (
    <div className="mb-4">
      <span className="text-sm block">{label}</span>
      <div className="w-full bg-gray-200 h-2 rounded">
        <div
          className="bg-blue-500 h-2 rounded"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
