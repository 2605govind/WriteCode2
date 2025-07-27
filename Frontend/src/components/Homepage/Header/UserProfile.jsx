import { NavLink } from 'react-router';

export default function UserProfile({ user, handleLogout }) {
  return (
    <div className="flex items-center gap-4">
      {user && (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-orange-400 flex items-center justify-center text-xs text-white">
            {user.fullName.charAt(0)}
          </div>
          <span className="text-sm">{user.firstName}</span>
        </div>
      )}
      {user?.role === 'admin' && (
        <NavLink
          to="/admin"
          className="text-sm px-3 py-1 rounded bg-[#1e1e1e] hover:bg-[#2a2a2a]"
        >
          Admin
        </NavLink>
      )}
      <button
        onClick={handleLogout}
        className="text-sm px-3 py-1 rounded bg-[#1e1e1e] hover:bg-[#2a2a2a]"
      >
        Logout
      </button>
    </div>
  );
}