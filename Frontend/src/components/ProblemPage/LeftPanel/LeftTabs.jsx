export default function LeftTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'editorial', label: 'Editorial' },
    { id: 'solutions', label: 'Solutions' },
    { id: 'submissions', label: 'Submissions' },
    { id: 'chatAI', label: 'ChatAI' }
  ];

  return (
    <div className="flex border-b border-gray-700 bg-[#1e1e1e]">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`px-3 py-2 text-xs font-medium relative transition-colors duration-200 ${
            activeTab === tab.id 
              ? 'text-orange-400 border-b-2 border-orange-400'
              : 'text-gray-400 hover:text-gray-300 hover:bg-[#2a2a2a]'
          }`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
          {activeTab === tab.id && (
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-orange-400"></span>
          )}
        </button>
      ))}
    </div>
  );
}