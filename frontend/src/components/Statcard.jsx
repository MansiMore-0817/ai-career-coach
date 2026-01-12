export default function StatCard({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <p className="text-gray-600 text-sm">{title}</p>
      <p className="text-xl font-semibold mt-1">{value}</p>
    </div>
  );
}
