import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r h-screen fixed left-0 top-0 p-4">
      <h1 className="text-xl font-semibold mb-6">AI Career Coach</h1>
      <nav className="space-y-2">
        <Link to="/" className="block p-2 rounded-lg hover:bg-gray-100">
          Dashboard
        </Link>

        <Link to="/roadmap" className="block p-2 rounded-lg hover:bg-gray-100">
          Roadmap
        </Link>

        <Link to="/resume" className="block p-2 rounded-lg hover:bg-gray-100">
          Resume Analyzer
        </Link>

        <Link to="/chat" className="block p-2 rounded-lg hover:bg-gray-100">
          Career Chat
        </Link>

        <hr className="my-4" />

        <Link to="/settings" className="block p-2 rounded-lg hover:bg-gray-100">
          Settings (coming soon)
        </Link>
      </nav>
    </aside>
  );
}
