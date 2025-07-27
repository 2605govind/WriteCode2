export default function TagList({ tags, activeTag, setActiveTag }) {
  return (
    <div className="bg-[#1e1e1e] rounded-lg border border-[#2a2a2a] p-4">
      <h3 className="font-medium mb-3">Tags</h3>
      <div className="space-y-2">
        {tags.map((tag) => (
          <button
            key={tag.name}
            onClick={() => setActiveTag(tag.name)}
            className={`w-full text-left px-2 py-1 text-sm rounded ${
              activeTag === tag.name
                ? 'bg-[#2a2a2a] text-white'
                : 'text-gray-300 hover:bg-[#2a2a2a]'
            }`}
          >
            {tag.name} ({tag.count})
          </button>
        ))}
      </div>
    </div>
  );
}