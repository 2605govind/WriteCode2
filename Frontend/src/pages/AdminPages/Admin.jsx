import React from 'react';
import { Plus, Edit, Trash2, BookText } from 'lucide-react';
import { NavLink } from 'react-router';
import DarkModeToggle from '../../components/DarkModeToggle.jsx';
import { useSelector } from 'react-redux';

function Admin() {
  const { user } = useSelector((state) => state.auth);

  const adminOptions = [
    {
      id: 'create',
      title: 'Create Problem',
      description: 'Add a new coding problem to the platform',
      icon: Plus,
      route: '/admin/create'
    },
    {
      id: 'delete',
      title: 'Delete Problem',
      description: 'Remove problems from the platform',
      icon: Trash2,
      route: '/admin/delete'
    },
    {
      id: 'courseinput',
      title: 'Add Course',
      description: 'Create new learning courses',
      icon: BookText,
      route: '/admin/courseinput'
    },
    {
      id: 'coursedelete',
      title: 'Delete Course',
      description: 'Delete course',
      icon: Trash2,
      route: '/admin/coursedelete'
    }
  ];

  return (
    <div className="bg-[#E0E0E0] dark:bg-[#121212] min-h-screen transition-colors duration-300">
      {/* Header */}
      <div className="bg-[#1e1e1e] py-4 px-6 flex justify-between items-center shadow-sm fixed w-full z-50">
        <div className="flex items-center gap-8">
          <NavLink to="/" className="text-xl font-semibold text-orange-400">
            WriteCode
          </NavLink>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-4 mr-6 ">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-orange-400 flex items-center justify-center text-xs text-white">
                  {user.fullName?.charAt(0)}
                </div>
                <span className="text-sm text-white">{user.firstName}</span>
                
              </div>
              {/* <div className="h-6 w-px bg-gray-500"></div> */}
            </div>
          )}
          <DarkModeToggle />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto pt-24 pb-12 px-6">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-[#121212] dark:text-[#E0E0E0] mb-4">
            Admin Panel
          </h1>
          <p className="text-[#888888] dark:text-[#B0B0B0]">
            Manage platform content and problems
          </p>
        </div>

        {/* Admin Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {adminOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <NavLink 
                key={option.id}
                to={option.route}
                className="group"
              >
                <div className="bg-white dark:bg-[#121212] p-6 rounded-lg border border-[#B0B0B0] dark:border-[#444444] shadow-sm transition-all duration-300 h-full flex flex-col items-center text-center group-hover:border-orange-400">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-full bg-[#F0F0F0] dark:bg-[#1E1E1E] flex items-center justify-center mb-4 transition-colors duration-300">
                    <IconComponent 
                      size={28} 
                      className="text-[#444444] dark:text-[#E0E0E0]" 
                    />
                  </div>
                  
                  {/* Title */}
                  <h2 className="text-xl font-semibold text-[#121212] dark:text-[#E0E0E0] mb-2">
                    {option.title}
                  </h2>
                  
                  {/* Description */}
                  <p className="text-[#888888] dark:text-[#B0B0B0] mb-6 flex-grow">
                    {option.description}
                  </p>
                  
                  {/* Action Button */}
                  <div className="px-4 py-2 border border-[#B0B0B0] dark:border-[#444444] rounded-md text-[#444444] dark:text-[#E0E0E0] transition-colors duration-300 group-hover:border-orange-400">
                    Access
                  </div>
                </div>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Admin;