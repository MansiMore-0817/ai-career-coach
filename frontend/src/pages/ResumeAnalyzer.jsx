import { useState } from "react";
import { analyzeResume } from "../services/ai";
import { extractPdfText } from "../utils/extractPdfText";
import { rewriteBullet } from "../services/ai";

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [role, setRole] = useState("MERN Developer");

  const [bullet, setBullet] = useState("");
  const [rewritten, setRewritten] = useState("");
  const [rewriting, setRewriting] = useState(false);

  const STAGES = [
    "Reading resume content",
    "Extracting technical skills",
    "Comparing role requirements",
    "Generating improvement suggestions",
  ];

  function handleFileChange(e) {
    setFile(e.target.files[0]);
  }

  async function handleAnalyze() {
    if (!file) return;

    setIsAnalyzing(true);
    setLoadingStage(0);
    setResult(null);

    // Stage animation
    const interval = setInterval(() => {
      setLoadingStage((prev) => {
        if (prev < STAGES.length - 1) return prev + 1;
        return prev;
      });
    }, 1200);

    let text = "";

    try {
      // Extract resume text
      if (file.type === "application/pdf") {
        text = await extractPdfText(file);
      } else {
        text = await file.text();
      }

      // Implementing request cache to avoid rate limits
      // This also speeds up repeated analyses of the same file
      // It is used to store analysis results in localStorage so that the same resume is not analyzed multiple times
      const cacheKey = `resume-analysis:${role}:${file.name}`;
      const cachedResult = localStorage.getItem(cacheKey);

      if (cachedResult) {
        console.log("Loaded resume analysis from cache");
        setResult(JSON.parse(cachedResult));
        setIsAnalyzing(false);
        return;
      }

      // Analyze resume via AI
      const analysis = await analyzeResume(text, role);
      const safeResult = {
        score: analysis.score ?? 0,
        skillsFound: analysis.skillsFound ?? [],
        skillsMissing: analysis.skillsMissing ?? [],
        suggestions: analysis.suggestions ?? [],
      };

      setResult(safeResult);

      // 💾 SAVE TO CACHE
      localStorage.setItem(cacheKey, JSON.stringify(safeResult)); //save to cache or cache partially completed result
    } catch (err) {
      console.error("Resume analysis failed:", err);

      if (err?.message?.includes("Rate limit")) {
        setResult({
          score: 0,
          skillsFound: [],
          skillsMissing: [],
          suggestions: ["AI rate limit reached. Please try again later."],
        });
      }
    } finally {
      clearInterval(interval);
      setIsAnalyzing(false);
    }
  }

  async function handleRewrite() {
    setRewriting(true);
    setRewritten("");

    try {
      const improved = await rewriteBullet(bullet, role);
      setRewritten(improved);
    } catch (err) {
      console.error(err);
    }

    setRewriting(false);
  }

  return (
    <main className="overflow-y-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Resume Analyzer 📄</h2>

      <div className="bg-white p-6 rounded-lg border shadow-sm mb-6">
        <h3 className="font-semibold mb-3">Target Role</h3>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm w-full sm:w-64"
        >
          <option>MERN Developer</option>
          <option>Backend Developer</option>
          <option>Frontend Developer</option>
          <option>AI/ML Engineer</option>
          <option>Data Analyst</option>
          <option>DevOps Engineer</option>
          <option>Full Stack Developer</option>
          <option>Cybersecurity Specialist</option>
          <option>Cloud Engineer</option>
          <option>UI/UX Designer</option>
          <option>Mobile App Developer</option>
          <option>iOS Developer</option>
          <option>Data Scientist/Data Analyst</option>
        </select>
      </div>

      {/* Upload box */}
      <div className="bg-white p-6 rounded-lg border shadow-sm mb-8">
        <h3 className="font-semibold mb-3">Upload Resume</h3>

        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:border-blue-500">
          <input
            type="file"
            accept=".txt,.pdf,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
          />
          <span className="text-gray-500">
            {file ? (
              <span className="text-blue-600 font-medium">{file.name}</span>
            ) : (
              "Drop file here or click to upload"
            )}
          </span>
        </label>

        <button
          onClick={handleAnalyze}
          disabled={!file || isAnalyzing}
          className={`mt-4 w-full sm:w-auto px-4 py-2 rounded-lg font-medium text-white ${
            file && !isAnalyzing
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
        </button>
      </div>

      {/* Staged Loading UI */}
      {isAnalyzing && (
        <div className="bg-blue-50 p-6 rounded-lg border mb-8">
          <p className="font-medium text-blue-700 mb-3">Analyzing resume…</p>

          <ul className="text-sm text-blue-600 space-y-1">
            {STAGES.map((stage, index) => (
              <li key={index}>
                {index < loadingStage
                  ? "✔"
                  : index === loadingStage
                  ? "⏳"
                  : "○"}{" "}
                {stage}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* display role to be analyzed */}
      <p className="text-sm text-gray-500 mb-3">
        Analyzed for: <span className="font-medium text-gray-800">{role}</span>
      </p>

      {/* Warning message for low scores */}
      {result && result.score <= 4 && (
        <div className="mb-4 p-3 rounded-lg bg-yellow-50 border border-yellow-300 text-sm text-yellow-800">
          ⚠️ This resume is not well aligned with the selected role. Consider
          switching roles or updating your resume.
        </div>
      )}

      {/* Result */}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h3 className="font-semibold mb-4">Analysis Results</h3>

        {!result && !isAnalyzing && (
          <p className="text-gray-500">Upload a resume to see insights 🤝</p>
        )}

        {result && (
          <div className="space-y-4">
            {/* Score */}
            <div>
              <p className="text-sm font-medium">Readiness Score</p>
              <div className="w-full bg-gray-200 h-2 rounded">
                <div
                  className="bg-green-500 h-2 rounded"
                  style={{ width: `${result.score * 10}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {result.score}/10 readiness
              </p>
            </div>

            {/* Skills Found */}
            <div>
              <p className="text-sm font-medium mb-2 text-green-700">
                Skills Found
              </p>
              <div className="flex flex-wrap gap-2">
                {result.skillsFound.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 border border-green-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Skill Match Overview */}
            <h3 className="font-semibold mb-4">Skill Match Overview</h3>
            <p className="text-xs text-gray-500 mb-3">
              Compared against role-specific requirements
            </p>

            {/* Skills Missing */}
            <div>
              <p className="text-sm font-medium mb-2 text-red-600">
                Missing Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {result.skillsMissing.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-600 border border-red-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            <div>
              <p className="text-sm font-medium">Suggestions</p>
              <ul className="list-disc ml-5 text-sm">
                {result.suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            {/* Rewrite Bullet Button */}
            {rewritten && (
              <div className="mt-4 p-4 rounded-lg bg-green-50 border border-green-300">
                <p className="text-xs text-gray-500 mb-1">Improved Bullet</p>
                <p className="text-sm text-gray-800">{rewritten}</p>
              </div>
            )}

            {/* Resume Bullet Rewriter */}
            <div className="mt-6">
              <h4 className="font-semibold mb-2">✍️ Rewrite Resume Bullet</h4>

              <textarea
                value={bullet}
                onChange={(e) => setBullet(e.target.value)}
                placeholder="Paste a resume bullet here..."
                className="w-full border rounded-lg p-3 text-sm mb-3"
                rows={3}
              />

              <button
                onClick={handleRewrite}
                disabled={!bullet || rewriting}
                className={`px-4 py-2 rounded-lg text-white text-sm ${
                  bullet && !rewriting
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                {rewriting ? "Rewriting..." : "Rewrite with AI"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
