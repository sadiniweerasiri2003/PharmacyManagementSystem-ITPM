import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserProfile = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');
  const userRole = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg py-2">
      <div className="px-4 py-2 border-b">
        <p className="text-sm font-medium text-gray-900">{userEmail}</p>
        <p className="text-xs text-gray-500 capitalize">{userRole}</p>
      </div>
      <button
        onClick={handleLogout}
        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        Logout
      </button>
    </div>
  );
};

export default UserProfile;
