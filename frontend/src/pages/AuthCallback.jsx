import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

const AuthCallback = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { handleGoogleCallback } = useAuth()

  useEffect(() => {
    const handleCallback = () => {
      const urlParams = new URLSearchParams(location.search)
      const token = urlParams.get('token')
      const userData = urlParams.get('user')
      const error = urlParams.get('error')

      if (error) {
        toast.error('Google authentication failed')
        navigate('/login')
        return
      }

      if (token && userData) {
        try {
          const parsedUserData = JSON.parse(decodeURIComponent(userData))
          const result = handleGoogleCallback(token, parsedUserData)
          
          if (result.success) {
            toast.success('Login successful!')
            // Redirect to dashboard or previous page
            const from = location.state?.from?.pathname || '/'
            navigate(from, { replace: true })
          } else {
            toast.error(result.message || 'Login failed')
            navigate('/login')
          }
        } catch (err) {
          console.error('Error parsing user data:', err)
          toast.error('Invalid user data received')
          navigate('/login')
        }
      } else {
        toast.error('Invalid callback data')
        navigate('/login')
      }
    }

    handleCallback()
  }, [location, handleGoogleCallback, navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Processing Google authentication...</p>
      </div>
    </div>
  )
}

export default AuthCallback