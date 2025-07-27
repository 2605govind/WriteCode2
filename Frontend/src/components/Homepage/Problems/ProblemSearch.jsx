export default function ProblemSearch({ searchValue, handleSearchChange, clearSearch }) {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search questions..."
        className="px-4 py-2 rounded-md bg-[#1e1e1e] border border-[#2a2a2a] text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-400 w-full md:w-64"
        value={searchValue}
        onChange={handleSearchChange}
      />
      {searchValue && (
        <button
          onClick={clearSearch}
          className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
        >
          ✕
        </button>
      )}
    </div>
  );
}