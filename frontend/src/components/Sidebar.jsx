import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaHome, 
  FaUserMd, 
  FaCalendarAlt, 
  FaChartBar, 
  FaCog, 
  FaBars, 
  FaTimes,
  FaUsers,
  FaFileAlt,
  FaBell,
  FaClipboardList,
  FaHospital,
  FaUser
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const Sidebar = ({ isOpen, onToggle }) => {
  const { user } = useAuth();
  const location = useLocation();

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: FaHome, roles: ['patient'] },
    { name: 'Dashboard', href: '/doctor/dashboard', icon: FaHome, roles: ['doctor'] },
    { name: 'Doctors', href: '/doctors', icon: FaUserMd, roles: ['patient'] },
    { name: 'Appointments', href: '/my-appointments', icon: FaCalendarAlt, roles: ['patient', 'doctor'] },
    { name: 'Today\'s Appointments', href: '/doctor/dashboard', icon: FaCalendarAlt, roles: ['doctor'] },
    { name: 'Manage Schedule', href: '/doctor/dashboard?tab=schedule', icon: FaClipboardList, roles: ['doctor'] },
    { name: 'Patients', href: '/doctor/dashboard?tab=patients', icon: FaUsers, roles: ['doctor'] },
    { name: 'Reports', href: '/doctor/dashboard?tab=reports', icon: FaChartBar, roles: ['doctor'] },
    { name: 'Profile', href: '/my-profile', icon: FaUser, roles: ['patient', 'doctor'] },
    { name: 'Settings', href: '/profile-settings', icon: FaCog, roles: ['patient', 'doctor'] },
  ];

  const filteredItems = navigationItems.filter(item => 
    item.roles.includes(user?.role || 'patient')
  );

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        className={`
          fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-xl z-50
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <Logo size="default" />
          <button
            onClick={onToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <FaTimes className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {filteredItems.map((item) => {
            // Special handling for doctor dashboard tabs
            let href = item.href;
            if (user?.role === 'doctor' && item.href.includes('/doctor/dashboard?tab=')) {
              href = '/doctor/dashboard';
            }
            
            const isActive = location.pathname === href;
            const Icon = item.icon;
            
            return (
              <NavLink
                key={item.name}
                to={href}
                onClick={() => window.innerWidth < 1024 && onToggle()}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-lg' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400'}`} />
                <span className="font-medium">{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-2 h-2 bg-white rounded-full"
                  />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {user?.role}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;