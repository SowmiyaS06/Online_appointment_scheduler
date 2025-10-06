import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaSignOutAlt, FaCog, FaUserMd, FaHospitalUser, FaUserShield } from 'react-icons/fa';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
      // Redirect to home page after logout
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getDashboardPath = () => {
    switch (user?.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'doctor':
        return '/doctor/dashboard';
      default:
        return '/dashboard';
    }
  };

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'admin':
        return <FaUserShield className="w-4 h-4" />;
      case 'doctor':
        return <FaUserMd className="w-4 h-4" />;
      default:
        return <FaHospitalUser className="w-4 h-4" />;
    }
  };

  const getRoleName = () => {
    switch (user?.role) {
      case 'admin':
        return 'Administrator';
      case 'doctor':
        return 'Doctor';
      default:
        return 'Patient';
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
      >
        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
          <FaUser className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </div>
        <span className="hidden sm:inline">{user?.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <FaUser className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{user?.name}</p>
                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                  {getRoleIcon()}
                  <span>{getRoleName()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="py-1">
            <button
              onClick={() => {
                navigate(getDashboardPath());
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
            >
              <FaUser className="w-4 h-4" />
              Dashboard
            </button>
            
            <button
              onClick={() => {
                navigate('/my-profile');
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
            >
              <FaCog className="w-4 h-4" />
              Profile Settings
            </button>
            
            <hr className="border-gray-200 dark:border-gray-700 my-1" />
            
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3"
            >
              <FaSignOutAlt className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;