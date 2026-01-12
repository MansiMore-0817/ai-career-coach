import { useState, useEffect } from "react";
import { generateRoadmap } from "../services/ai";
import { addXP } from "../utils/xp";
import { earnBadge } from "../utils/badges";

import { useRef } from "react";

export default function Roadmap() {
  const focusBonusGiven = useRef(false);
  const weekCompletedRef = useRef({});

  const [role, setRole] = useState("mern");

  const [loading, setLoading] = useState(false);

  async function getNewRoadmap() {
    setLoading(true);

    try {
      const rawTasks = await generateRoadmap(role, currentWeek);

      const newTasks = rawTasks.map((task, index) => ({
        id: `${currentWeek}-${index}`,
        ...task,
      }));

      setWeeklyTasks((prev) => ({
        ...prev,
        [currentWeek]: newTasks,
      }));

      earnBadge("first-roadmap");

    } catch (err) {
      console.warn("AI failed, using mock roadmap");

      const mockTasks = [
        { id: `${currentWeek}-0`, text: "Revise core concepts", done: false },
        {
          id: `${currentWeek}-1`,
          text: "Build a small project feature",
          done: false,
        },
        {
          id: `${currentWeek}-2`,
          text: "Practice interview questions",
          done: false,
        },
        {
          id: `${currentWeek}-3`,
          text: "Apply learnings to real use case",
          done: false,
        },
      ];

      setWeeklyTasks((prev) => ({
        ...prev,
        [currentWeek]: mockTasks,
      }));
    }

    setLoading(false);
  }

  const [currentWeek, setCurrentWeek] = useState(1);

  const [weeklyTasks, setWeeklyTasks] = useState(() => {
    const saved = localStorage.getItem("weekly-roadmap");

    return saved
      ? JSON.parse(saved)
      : {
          1: [],
          2: [],
          3: [],
          4: [],
        };
  });

  const tasks = weeklyTasks[currentWeek] || [];

  const [todayTasks, setTodayTasks] = useState([]);

  useEffect(() => {
    localStorage.setItem("weekly-roadmap", JSON.stringify(weeklyTasks));
  }, [weeklyTasks]);

  function toggleTask(id) {
    setWeeklyTasks((prev) => ({
      ...prev,
      [currentWeek]: prev[currentWeek].map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      ),
    }));
  }

  useEffect(() => {
    const pending = tasks.filter((task) => !task.done);
    setTodayTasks(pending.slice(0, 3));
  }, [tasks]);

  const completed = tasks.filter((t) => t.done).length;

  useEffect(() => {
  if (completed >= 7) {
    earnBadge("task-7");
  }
}, [completed]);


  const percent =
    tasks.length === 0 ? 0 : Math.round((completed / tasks.length) * 100);

  useEffect(() => {
    if (
      tasks.length > 0 &&
      completed === tasks.length &&
      !weekCompletedRef.current[currentWeek]
    ) {
      // mark week as completed
      weekCompletedRef.current[currentWeek] = true;

      // give XP bonus
      addXP(100);

      // auto-advance to next week (if exists)
      if (currentWeek < 4) {
        setTimeout(() => {
          setCurrentWeek((prev) => prev + 1);
        }, 800); // small UX delay
      }
    }
  }, [completed, tasks.length, currentWeek]);


  const isProgramCompleted =
    currentWeek === 4 && tasks.length > 0 && completed === tasks.length;


// Program Completion Badge
  useEffect(() => {
  if (isProgramCompleted) {
    earnBadge("program-complete");
  }
}, [isProgramCompleted]);




  useEffect(() => {
  if (tasks.length === 0) return;

  const isWeekComplete = completed === tasks.length;

  if (isWeekComplete && !weekCompletedRef.current[currentWeek]) {
    weekCompletedRef.current[currentWeek] = true;

    addXP(100);

    // 🏁 STEP 2C — First Week badge
    if (currentWeek === 1) {
      earnBadge("first-week");
    }

    if (currentWeek < 4) {
      setTimeout(() => {
        setCurrentWeek(prev => prev + 1);
      }, 600);
    }
  }
}, [completed, tasks.length, currentWeek]);


  useEffect(() => {
    // allow completion logic for new week
    if (!weekCompletedRef.current[currentWeek]) {
      focusBonusGiven.current = false;
    }
  }, [currentWeek]);

  useEffect(() => {
    // auto-generate roadmap when switching to a new week
    if (weeklyTasks[currentWeek]?.length === 0 && !loading) {
      getNewRoadmap();
    }
  }, [currentWeek]);

  




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
        <p className="text-sm text-gray-500 mb-4">
          Currently viewing: <strong>Week {currentWeek}</strong>
        </p>

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

      {tasks.length > 0 && completed === tasks.length && (
        <p className="mt-2 text-sm text-green-600 font-medium">
          🎉 Week {currentWeek} completed!
        </p>
      )}

      {/* Program Completion Card */}

      {isProgramCompleted && (
        <div className="mt-6 p-6 rounded-xl border border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 shadow-sm">
          <h3 className="text-lg font-semibold text-green-700 mb-2">
            🎓 Program Completed!
          </h3>

          <p className="text-sm text-green-700 mb-4">
            Amazing work! You’ve successfully completed all 4 weeks of your
            learning roadmap.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => {
                localStorage.removeItem("weekly-roadmap");
                window.location.reload();
              }}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
            >
              🔁 Restart Program
            </button>

            <button
              onClick={() => setRole("backend")}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 text-sm hover:bg-gray-300"
            >
              🔀 Switch Track
            </button>

            <button
              onClick={() => alert("Export coming soon 🚀")}
              className="px-4 py-2 rounded-lg bg-white border text-gray-700 text-sm hover:bg-gray-50"
            >
              📄 Export Progress
            </button>
          </div>
        </div>
      )}

      {/* Program Completion Message */}
      {currentWeek === 4 && completed === tasks.length && tasks.length > 0 && (
        <div className="mt-4 p-4 rounded-lg bg-green-100 border border-green-300">
          <p className="font-semibold text-green-700">🎓 Program Completed!</p>
          <p className="text-sm text-green-600 mt-1">
            You’ve completed all 4 weeks. You can now:
          </p>
          <ul className="text-sm text-green-600 list-disc ml-5 mt-2">
            <li>Restart the roadmap</li>
            <li>Switch career track</li>
            <li>Export your progress</li>
          </ul>
        </div>
      )}


      {isProgramCompleted && (
  <p className="text-sm text-green-600 mb-3">
    ✔ All tasks completed. Great consistency throughout the program!
  </p>
)}

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
