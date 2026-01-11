import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import Roadmap from "./pages/Roadmap";
import CareerChat from "./pages/CareerChat";

import { Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex flex-col flex-1 ml-64">
        <Navbar />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/resume" element={<ResumeAnalyzer />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/chat" element={<CareerChat />} />
        </Routes>
      </div>
    </div>
  );
}
