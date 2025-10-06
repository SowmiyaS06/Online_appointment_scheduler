import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'
import Button from './Button'
import ThemeToggle from './ThemeToggle'
import UserMenu from './UserMenu'

const Navbar = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Logo size="default" />
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => navigate('/')} 
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
            >
              Home
            </button>
            <button 
              onClick={() => navigate('/doctors')} 
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
            >
              Doctors
            </button>
            <button 
              onClick={() => navigate('/about')} 
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
            >
              About
            </button>
            <button 
              onClick={() => navigate('/contact')} 
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
            >
              Contact
            </button>
            <button 
              onClick={() => navigate('/admin-login')} 
              className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium"
            >
              Admin
            </button>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/login')}
                  className="hidden sm:inline"
                >
                  Login
                </Button>
                <Button onClick={() => navigate('/login')}>
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar