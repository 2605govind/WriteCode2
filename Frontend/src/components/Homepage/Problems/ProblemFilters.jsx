const filterButtonClass = (active) =>
  `text-xs px-3 py-1 rounded-lg transition-all duration-150 ${
    active
      ? 'bg-[#1e1e1e] text-white'
      : 'bg-[#1e1e1e] text-gray-300 hover:bg-[#2a2a2a]'
  }`;

export default function ProblemFilters({ filters, setFilters }) {
  return (
    <div className="flex gap-2 mb-4">
      {['all', 'easy', 'medium', 'hard'].map((difficulty) => (
        <button
          key={difficulty}
          onClick={() => setFilters(prev => ({ ...prev, difficulty }))}
          className={filterButtonClass(filters.difficulty === difficulty)}
        >
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </button>
      ))}
    </div>
  );
}