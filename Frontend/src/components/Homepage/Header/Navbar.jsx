import { NavLink } from 'react-router';
import UserProfile from './UserProfile';

export default function Navbar({ user, handleLogout }) {
  return (
    <div className="bg-[#1e1e1e] py-3 px-6 flex justify-between items-center shadow-sm fixed w-full z-50">
      <div className="flex items-center gap-8">
        <NavLink to="/" className="text-xl font-semibold text-orange-400">
          WriteCode
        </NavLink>
      </div>
      <UserProfile user={user} handleLogout={handleLogout} />
    </div>
  );
}