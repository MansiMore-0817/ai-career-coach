export default function Navbar() {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6 sticky top-0">
      <input
        type="text"
        placeholder="Search..."
        className="border rounded-lg px-3 py-1 w-64 text-sm"
      />

      <div className="flex items-center gap-4">
        <button>🔔</button>
        <div className="flex items-center gap-2">
          <img
            src="https://via.placeholder.com/32"
            alt="user"
            className="rounded-full"
          />
          <span className="text-sm font-medium">Alex Johnson</span>
        </div>
      </div>
    </header>
  );
}
