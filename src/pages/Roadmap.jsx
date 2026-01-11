import { useState, useEffect } from "react";
import { generateRoadmap } from "../services/ai";
import { addXP } from "../utils/xp";

import { useRef } from "react";


export default function Roadmap() {
          const focusBonusGiven = useRef(false);

  const [role, setRole] = useState("mern");

  const [loading, setLoading] = useState(false);
  async function getNewRoadmap() {
    setLoading(true);

    try {
      const newTasks = await generateRoadmap(role);
      setTasks(newTasks);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("roadmap-tasks");
    return saved
      ? JSON.parse(saved)
      : [
          { id: 1, text: "Complete DSA arrays", done: false },
          { id: 2, text: "Watch 1 mock interview video", done: true },
          { id: 3, text: "Apply to 3 internships", done: false },
          { id: 4, text: "Build 1 project component", done: false },
        ];
  });

  const [todayTasks, setTodayTasks] = useState([]);

  useEffect(() => {
    localStorage.setItem("roadmap-tasks", JSON.stringify(tasks));
  }, [tasks]);

 function toggleTask(id) {
  setTasks(prev =>
    prev.map(task => {
      if (task.id === id) {
        // Only award XP when marking as DONE
        if (!task.done) addXP(10);
        return { ...task, done: !task.done };
      }
      return task;
    })
  );
}


  useEffect(() => {
    const pending = tasks.filter((task) => !task.done);
    setTodayTasks(pending.slice(0, 3));
  }, [tasks]);


  const completed = tasks.filter((t) => t.done).length;
  const percent = Math.round((completed / tasks.length) * 100);

  useEffect(() => {
  if (todayTasks.length === 0 && tasks.length > 0 && !focusBonusGiven.current) {
    addXP(30); // daily bonus
    focusBonusGiven.current = true;
  }
}, [todayTasks, tasks]);


  return (
    <main className="overflow-y-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">This Week's Roadmap 🗓️</h2>
      <div className="flex items-center gap-3 mb-4">
        <label className="font-medium text-sm">Choose Track:</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="mern">MERN Developer</option>
          <option value="backend">Backend Developer</option>
          <option value="ai">AI/ML Engineer</option>
          <option value="data">Data Analyst/Scientist</option>
          <option value="devops">DevOps Engineer</option>
          <option value="cyber">Cybersecurity Track</option>
          <option value="frontend">Frontend Developer</option>
        </select>
      </div>
      {/* Generate Button */}

      <button
        onClick={getNewRoadmap}
        disabled={loading}
        className={`mb-6 px-4 py-2 rounded-lg font-medium text-white ${
          loading
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Generating..." : "Generate New Roadmap"}
      </button>

      {/* Today's Focus */}
      <div className="bg-white p-6 rounded-lg border shadow-sm mb-6">
        <h3 className="font-semibold mb-4">🎯 Today’s Focus</h3>

        {todayTasks.length === 0 ? (
          <p className="text-sm text-gray-500">
            All tasks completed for today 🎉
          </p>
        ) : (
          <div className="space-y-3">
            {todayTasks.map((task, idx) => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200"
              >
                <span className="text-xs font-bold text-blue-600">
                  #{idx + 1}
                </span>

                <p className="text-sm text-gray-800">{task.text}</p>
              </div>
            ))}
          </div>
        )}

        
      </div>



        


      {/* Progress Card */}
      <div className="bg-white p-6 rounded-lg border shadow-sm mb-8">
        <p className="font-medium mb-2">Weekly Completion</p>
        <div className="w-full bg-gray-200 h-2 rounded">
          <div
            className="bg-blue-500 h-2 rounded"
            style={{ width: `${percent}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {completed} / {tasks.length} tasks done ({percent}%)
        </p>
      </div>

      {/* Tasks List */}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h3 className="font-semibold mb-4">Tasks</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task, idx) => (
            <div
              key={task.id || task.text}
              className={`relative p-4 rounded-xl border shadow-sm transition cursor-pointer ${
                task.done
                  ? "bg-green-50 border-green-400 shadow-md"
                  : "bg-white hover:shadow-md"
              }`}
              onClick={() => toggleTask(task.id)}
            >
              <span className="text-xs absolute top-2 right-2 bg-gray-200 px-2 py-1 rounded-full">
                #{idx + 1}
              </span>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleTask(task.id)}
                  className="h-5 w-5 mt-1 transition-all duration-200"
                />
                <p
                  className={`text-sm font-medium ${
                    task.done ? "line-through text-gray-400" : "text-gray-700"
                  }`}
                >
                  {task.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
