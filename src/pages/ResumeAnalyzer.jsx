import { useState } from "react";
import { analyzeResume } from "../services/ai";
import { extractPdfText } from "../utils/extractPdfText";


export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleFileChange(e) {
    setFile(e.target.files[0]);
  }

 async function handleAnalyze() {
  if (!file) return;

  setLoading(true);
  setResult(null);

  let text = "";

  // Check file type
  if (file.type === "application/pdf") {
    text = await extractPdfText(file);
  } else {
    text = await file.text();
  }

  try {
    const analysis = await analyzeResume(text);
    setResult(analysis);
  } catch (err) {
    console.error(err);
  }

  setLoading(false);
}


  return (
    <main className="overflow-y-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Resume Analyzer 📄</h2>

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
          disabled={!file || loading}
          className={`mt-4 w-full sm:w-auto px-4 py-2 rounded-lg font-medium text-white 
            ${file && !loading
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-300 cursor-not-allowed"}`}
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>
      </div>

      {/* Result */}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h3 className="font-semibold mb-4">Analysis Results</h3>

        {!result && !loading && (
          <p className="text-gray-500">
            Upload a resume to see insights 🤝
          </p>
        )}

        {loading && <p className="text-gray-500">Thinking... 🧠</p>}

        {result && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">ATS Score</p>
              <div className="w-full bg-gray-200 h-2 rounded">
                <div
                  className="bg-green-500 h-2 rounded"
                  style={{ width: `${result.score}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{result.score}% match</p>
            </div>

            <div>
              <p className="text-sm font-medium">Missing Skills</p>
              <ul className="list-disc ml-5 text-sm text-red-500">
                {result.skills.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-sm font-medium">Suggestions</p>
              <ul className="list-disc ml-5 text-sm">
                {result.suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
