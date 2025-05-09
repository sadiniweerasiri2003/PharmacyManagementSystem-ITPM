import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SearchIcon, ChevronDownIcon, UserIcon } from 'lucide-react';
import UserProfile from '../UserProfile';

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const userEmail = localStorage.getItem('userEmail');
  const userRole = localStorage.getItem('role');
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/sales':
        return 'Sales Dashboard';
      case '/dashboard':
        return 'Overview';
      default:
        return 'Overview';
    }
  };

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="text-lg font-medium">
          <h1 className="text-gray-800 font-semibold">{getPageTitle()}</h1>
        </div>
        <div className="flex items-center">
          <div className="relative mr-4">
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 bg-gray-50 rounded-full w-[300px] text-sm focus:outline-none"
            />
            <SearchIcon size={18} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          <div className="relative">
            <div 
              className="flex items-center cursor-pointer" 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden mr-2 flex items-center justify-center">
                <UserIcon size={24} className="text-gray-600" />
              </div>
              <div className="mr-2">
                <div className="text-sm font-medium">{userEmail}</div>
                <div className="text-xs text-gray-500 capitalize">{userRole}</div>
              </div>
              <ChevronDownIcon size={16} className="text-gray-400" />
            </div>

            <UserProfile 
              isOpen={isProfileOpen}
              onClose={() => setIsProfileOpen(false)}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;