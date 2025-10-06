import React from 'react'
import {Route,Routes, Navigate} from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { LanguageProvider } from './context/LanguageContext'
import SimpleProtectedRoute from './components/SimpleProtectedRoute'
import DashboardLayout from './components/DashboardLayout'
import SimpleDashboardLayout from './components/SimpleDashboardLayout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import AuthCallback from './pages/AuthCallback'
import Contact from './pages/Contact'
import About from './pages/About'
import Appointment from './pages/Appointment'
import MyAppointments from './pages/MyAppointments'
import MyProfile from './pages/MyProfile'
import DoctorDashboard from './pages/DoctorDashboard'
import ProfileSettings from './pages/ProfileSettings'
import DebugAuth from './pages/DebugAuth'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

const App = () => {
  return (
    <LanguageProvider>
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<Home/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/admin-login' element={<AdminLogin/>} />
        <Route path='/auth/callback' element={<AuthCallback/>} />
        <Route path='/about' element={<About/>} />
        <Route path='/contact' element={<Contact/>} />
        <Route path='/doctors' element={<Doctors/>} />
        <Route path='/doctors/:speciality' element={<Doctors/>} />
        <Route path='/debug-auth' element={<DebugAuth/>} />
        
        {/* Protected Routes with Dashboard Layout */}
        <Route path='/dashboard' element={
          <SimpleProtectedRoute>
            <DashboardLayout>
              <Dashboard/>
            </DashboardLayout>
          </SimpleProtectedRoute>
        } />
        <Route path='/admin/dashboard' element={
          <SimpleProtectedRoute requiredRoles={['admin']}>
            <SimpleDashboardLayout>
              <AdminDashboard/>
            </SimpleDashboardLayout>
          </SimpleProtectedRoute>
        } />
        <Route path='/doctor/dashboard' element={
          <SimpleProtectedRoute requiredRoles={['doctor']}>
            <DashboardLayout>
              <DoctorDashboard/>
            </DashboardLayout>
          </SimpleProtectedRoute>
        } />
        <Route path='/my-profile' element={
          <SimpleProtectedRoute>
            <DashboardLayout>
              <MyProfile/>
            </DashboardLayout>
          </SimpleProtectedRoute>
        } />
        <Route path='/profile-settings' element={
          <SimpleProtectedRoute>
            <DashboardLayout>
              <ProfileSettings/>
            </DashboardLayout>
          </SimpleProtectedRoute>
        } />
        <Route path='/my-appointments' element={
          <SimpleProtectedRoute>
            <DashboardLayout>
              <MyAppointments/>
            </DashboardLayout>
          </SimpleProtectedRoute>
        } />
        <Route path='/appointments/:docId' element={
          <SimpleProtectedRoute requiredRoles={['patient']}>
            <DashboardLayout>
              <Appointment/>
            </DashboardLayout>
          </SimpleProtectedRoute>
        } />
        
        {/* Unauthorized route */}
        <Route path='/unauthorized' element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Unauthorized Access</h1>
              <p className="text-gray-700 dark:text-gray-300 mb-6">You don't have permission to access this page.</p>
              <a href="/" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                Go back to home
              </a>
            </div>
          </div>
        } />
        
        {/* Catch-all route - redirect to home */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </LanguageProvider>
  )
}

export default App