export default function CompanyList({ companies }) {
  return (
    <div className="bg-[#1e1e1e] rounded-lg border border-[#2a2a2a] overflow-hidden">
      <div className="p-4 border-b border-[#2a2a2a]">
        <h3 className="font-medium">Companies</h3>
      </div>
      <div className="max-h-64 overflow-y-auto">
        {companies.map((company) => (
          <div
            key={company.company}
            className="p-3 border-b border-[#2a2a2a] hover:bg-[#2a2a2a] cursor-pointer flex justify-between items-center"
          >
            <span>{company.company}</span>
            <span className="text-xs bg-[#2a2a2a] px-2 py-1 rounded">
              {company.problemCount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}