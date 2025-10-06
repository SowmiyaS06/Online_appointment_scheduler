import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaGoogle, FaEye, FaEyeSlash, FaUserMd, FaHospitalUser, FaUserShield } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

const Login = () => {
  const [state, setState] = useState('Login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('patient') // Default role for sign up
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [googleAuthAvailable, setGoogleAuthAvailable] = useState(false)
  
  const { login, register, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Check if Google OAuth is available
  useEffect(() => {
    const checkGoogleAuthAvailability = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/health', {
          method: 'GET',
          mode: 'cors'
        });
        
        if (response.ok) {
          const data = await response.json();
          setGoogleAuthAvailable(data.googleOAuthConfigured || false);
        }
      } catch (error) {
        console.log('Backend not available for Google OAuth');
      }
    };
    
    checkGoogleAuthAvailability();
  }, []);

  // Redirect based on user role after authentication
  useEffect(() => {
    if (isAuthenticated && user && user.role) {
      // Redirect based on user role
      switch (user.role) {
        case 'admin':
          navigate('/admin/dashboard', { replace: true });
          break;
        case 'doctor':
          navigate('/doctor/dashboard', { replace: true });
          break;
        case 'patient':
        default:
          // For patients, redirect to patient dashboard
          navigate('/dashboard', { replace: true });
          break;
      }
    }
  }, [isAuthenticated, user, navigate, location]);

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      let result
      if (state === 'Sign Up') {
        result = await register(name, email, password, role)
      } else {
        result = await login(email, password)
      }

      if (result.success) {
        toast.success(`${state === 'Sign Up' ? 'Registration' : 'Login'} successful!`)
        // Redirect based on user role
        switch (result.user.role) {
          case 'admin':
            navigate('/admin/dashboard')
            break
          case 'doctor':
            navigate('/doctor/dashboard')
            break
          case 'patient':
          default:
            // For patients, redirect to patient dashboard
            navigate('/dashboard')
            break
        }
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    // Check if backend is running
    try {
      const response = await fetch('http://localhost:5000/api/health', {
        method: 'GET',
        mode: 'cors'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.googleOAuthConfigured) {
          // Backend is running with Google OAuth configured, proceed with real Google OAuth
          window.location.href = 'http://localhost:5000/api/auth/google';
        } else {
          // Backend is running but Google OAuth is not configured
          toast.info('Google OAuth is not configured. Contact support.');
        }
      } else {
        throw new Error('Backend not responding');
      }
    } catch (error) {
      // Backend is not running
      toast.error('Backend server not responding. Please try again later.');
    }
  }

  // Role selection component
  const RoleSelection = () => (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div 
        className={`bg-blue-50 dark:bg-gray-700 rounded-lg p-4 text-center cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-600 transition-colors ${
          role === 'patient' ? 'ring-2 ring-blue-500' : ''
        }`}
        onClick={() => setRole('patient')}
      >
        <FaHospitalUser className="w-8 h-8 mx-auto mb-2 text-blue-500 dark:text-blue-400" />
        <span className="font-medium text-gray-700 dark:text-gray-300">Patient</span>
      </div>
      <div 
        className={`bg-green-50 dark:bg-gray-700 rounded-lg p-4 text-center cursor-pointer hover:bg-green-100 dark:hover:bg-gray-600 transition-colors ${
          role === 'doctor' ? 'ring-2 ring-green-500' : ''
        }`}
        onClick={() => setRole('doctor')}
      >
        <FaUserMd className="w-8 h-8 mx-auto mb-2 text-green-500 dark:text-green-400" />
        <span className="font-medium text-gray-700 dark:text-gray-300">Doctor</span>
      </div>
      <div 
        className={`bg-purple-50 dark:bg-gray-700 rounded-lg p-4 text-center cursor-pointer hover:bg-purple-100 dark:hover:bg-gray-600 transition-colors ${
          role === 'admin' ? 'ring-2 ring-purple-500' : ''
        }`}
        onClick={() => setRole('admin')}
      >
        <FaUserShield className="w-8 h-8 mx-auto mb-2 text-purple-500 dark:text-purple-400" />
        <span className="font-medium text-gray-700 dark:text-gray-300">Admin</span>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="hidden lg:flex flex-col justify-center items-center text-center p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 inline-block">
              <div className="bg-gradient-to-r from-blue-500 to-teal-500 text-white text-4xl w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaUserMd />
              </div>
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            MedBook
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-md"
          >
            Your complete healthcare appointment management solution
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-3 gap-4"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
              <div className="text-2xl font-bold text-blue-500 dark:text-blue-400">10K+</div>
              <div className="text-gray-600 dark:text-gray-400">Patients</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
              <div className="text-2xl font-bold text-green-500 dark:text-green-400">500+</div>
              <div className="text-gray-600 dark:text-gray-400">Doctors</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
              <div className="text-2xl font-bold text-purple-500 dark:text-purple-400">99%</div>
              <div className="text-gray-600 dark:text-gray-400">Satisfaction</div>
            </div>
          </motion.div>
        </div>
        
        {/* Right side - Login Form */}
        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {state === 'Sign Up' ? 'Create Account' : 'Welcome Back'}
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  {state === 'Sign Up' 
                    ? 'Join MedBook to manage your healthcare appointments' 
                    : 'Sign in to your MedBook account'
                  }
                </p>
              </div>

              <form onSubmit={onSubmitHandler} className="space-y-6">
                {/* Full Name - only for Sign Up */}
                {state === "Sign Up" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your full name"
                      required
                    />
                  </motion.div>
                )}

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Role Selection for Sign Up */}
                {state === "Sign Up" && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Account Type
                    </label>
                    <RoleSelection />
                  </div>
                )}

                {/* Special note for admin login */}
                {state === "Login" && (
                  <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                    <p><strong>Note:</strong> Admin login requires special credentials</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {state === 'Sign Up' ? 'Creating Account...' : 'Signing In...'}
                    </div>
                  ) : (
                    state === 'Sign Up' ? 'Create Account' : 'Sign In'
                  )}
                </button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Google Login Button */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium py-3 px-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300"
                >
                  <FaGoogle className="w-5 h-5 text-red-500" />
                  Continue with Google
                </button>

                {/* Toggle Sign Up / Login */}
                <div className="text-center">
                  <p className="text-gray-600 dark:text-gray-300">
                    {state === "Sign Up" ? "Already have an account?" : "Don't have an account?"}
                    <button
                      type="button"
                      onClick={() => setState(state === 'Sign Up' ? 'Login' : 'Sign Up')}
                      className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                    >
                      {state === 'Sign Up' ? 'Sign In' : 'Sign Up'}
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Login