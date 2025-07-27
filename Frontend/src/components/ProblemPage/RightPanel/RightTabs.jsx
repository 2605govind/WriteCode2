import { useEffect, useRef } from 'react';

export default function RightTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'code', label: 'Code' },
    { id: 'testcase', label: 'Test Cases' },
    { id: 'result', label: 'Results' }
  ];

  const tabRefs = useRef({});

  // Auto-focus the active tab for better keyboard navigation
  useEffect(() => {
    if (tabRefs.current[activeTab]) {
      tabRefs.current[activeTab].focus();
    }
  }, [activeTab]);

  return (
    <div className="flex border-b border-gray-700 bg-[#1e1e1e]">
      {tabs.map(tab => (
        <button
          key={tab.id}
          ref={el => tabRefs.current[tab.id] = el}
          className={`px-3 py-2 text-xs font-medium relative transition-colors duration-200 ${
            activeTab === tab.id 
              ? 'text-orange-400'
              : 'text-gray-400 hover:text-gray-300 hover:bg-[#2a2a2a]'
          } focus:outline-none`}
          onClick={() => setActiveTab(tab.id)}
          aria-current={activeTab === tab.id ? 'page' : undefined}
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