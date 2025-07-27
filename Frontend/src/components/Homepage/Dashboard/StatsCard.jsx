export default function StatsCard({ title, count, easy, medium, hard }) {
  return (
    <div className="bg-[#1e1e1e] p-4 rounded-lg border border-[#2a2a2a]">
      <h3 className="text-sm font-medium text-gray-400 mb-2">{title}</h3>
      <p className="text-2xl font-bold">{count} Problems</p>
      <div className="mt-2 flex gap-1">
        <span className="text-xs px-2 py-1 bg-green-900 text-green-300 rounded">
          Easy: {easy}
        </span>
        <span className="text-xs px-2 py-1 bg-yellow-900 text-yellow-300 rounded">
          Medium: {medium}
        </span>
        <span className="text-xs px-2 py-1 bg-red-900 text-red-300 rounded">
          Hard: {hard}
        </span>
      </div>
    </div>
  );
}