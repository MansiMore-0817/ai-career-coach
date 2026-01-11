import { useEffect, useState } from "react";
import { getOrUpdateStreak } from "../utils/streak";
import StatCard from "../components/Statcard";
import { getXPData } from "../utils/xp";

export default function Dashboard() {
  const [streak, setStreak] = useState(1);
  const [xpData, setXpData] = useState({ xp: 0, level: "Beginner 🐣" });

  useEffect(() => {
    const data = getOrUpdateStreak();
    setStreak(data.streak);
  }, []);

  useEffect(() => {
    setXpData(getXPData());
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
