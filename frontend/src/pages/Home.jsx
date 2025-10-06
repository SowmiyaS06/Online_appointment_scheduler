import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  FaArrowRight, 
  FaUserMd, 
  FaCalendarAlt, 
  FaShieldAlt, 
  FaClock, 
  FaStar,
  FaSearch,
  FaHospital,
  FaStethoscope,
  FaBell,
  FaVideo,
  FaUserClock,
  FaAmbulance,
  FaRobot
} from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'
import Button from '../components/Button'
import Card from '../components/Card'
import ThemeToggle from '../components/ThemeToggle'
import Navbar from '../components/Navbar'
import AISymptomChecker from '../components/AISymptomChecker'
import WaitlistTracker from '../components/WaitlistTracker'
import EmergencyBooking from '../components/EmergencyBooking'
import { assets } from '../assets/assets'

const Home = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [showSymptomChecker, setShowSymptomChecker] = useState(false)
  const [showWaitlist, setShowWaitlist] = useState(false)
  const [showEmergency, setShowEmergency] = useState(false)

  const features = [
    {
      icon: <FaUserMd className="w-8 h-8 text-blue-500" />,
      title: "Expert Doctors",
      description: "Access to qualified healthcare professionals across various specialties"
    },
    {
      icon: <FaCalendarAlt className="w-8 h-8 text-green-500" />,
      title: "Easy Booking",
      description: "Schedule appointments with just a few clicks, 24/7 availability"
    },
    {
      icon: <FaShieldAlt className="w-8 h-8 text-purple-500" />,
      title: "Secure & Private",
      description: "Your health data is protected with enterprise-grade security"
    },
    {
      icon: <FaClock className="w-8 h-8 text-orange-500" />,
      title: "Real-time Updates",
      description: "Get instant notifications about your appointments and reminders"
    },
    {
      icon: <FaVideo className="w-8 h-8 text-red-500" />,
      title: "Teleconsultation",
      description: "Connect with doctors through secure video calls from anywhere"
    },
    {
      icon: <FaBell className="w-8 h-8 text-teal-500" />,
      title: "Smart Reminders",
      description: "Never miss an appointment with automated SMS and email reminders"
    }
  ]

  const stats = [
    { number: "10K+", label: "Happy Patients" },
    { number: "500+", label: "Expert Doctors" },
    { number: "50+", label: "Specialties" },
    { number: "99%", label: "Satisfaction Rate" }
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/doctors?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      {/* Hero Section */}
      <section className="pt-16 bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Book Your Doctor Appointment Instantly with 
                <span className="text-blue-600 dark:text-blue-400"> MedBook</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Find the right doctor, schedule appointments, and get reminders - all in one place.
                Your health is our priority.
              </p>
              
              {/* Quick Search */}
              <form onSubmit={handleSearch} className="mb-8">
                <div className="relative max-w-2xl">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search doctors, specialties, or hospitals..."
                    className="w-full px-6 py-4 pr-12 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <button 
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-blue-600 dark:bg-blue-500 rounded-full text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                  >
                    <FaSearch className="w-5 h-5" />
                  </button>
                </div>
              </form>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="large" 
                  onClick={() => navigate('/doctors')}
                  className="flex items-center gap-2"
                >
                  Find Doctors
                  <FaArrowRight />
                </Button>
                <Button 
                  variant="outline" 
                  size="large"
                  onClick={() => setShowSymptomChecker(true)}
                  className="flex items-center gap-2"
                >
                  <FaRobot className="w-5 h-5" />
                  AI Symptom Checker
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src={assets.header_img} 
                  alt="Doctor" 
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    // Fallback if the image fails to load
                    console.log('Failed to load header image');
                    e.target.src = 'https://via.placeholder.com/800x600.png?text=Doctor+Image';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent"></div>
              </div>
              
              {/* Floating Stats Cards */}
              <motion.div 
                className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                    <FaStar className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-bold text-lg text-gray-900 dark:text-white">4.9/5</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Patient Rating</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="absolute -top-6 -right-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                    <FaUserClock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-bold text-lg text-gray-900 dark:text-white">24/7</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Availability</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <p className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {stat.number}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Why Choose MedBook?
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              We're transforming healthcare with cutting-edge technology and a patient-first approach
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              How MedBook Works
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Getting the care you need has never been easier
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Find Your Doctor</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Browse our network of verified healthcare professionals by specialty, location, or availability.
              </p>
            </motion.div>
            
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Book Appointment</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Select a convenient time slot and confirm your appointment with just a few clicks.
              </p>
            </motion.div>
            
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="bg-purple-100 dark:bg-purple-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Get Care</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Attend your appointment in-person or via secure video consultation.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Healthcare Experience?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join thousands of patients who trust MedBook for their healthcare needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="large" 
                onClick={() => navigate('/doctors')}
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Browse Doctors
              </Button>
              <Button 
                variant="outline" 
                size="large"
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
                className="border-white text-white hover:bg-white/10"
              >
                {isAuthenticated ? 'My Dashboard' : 'Login / Register'}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modals */}
      {showSymptomChecker && (
        <AISymptomChecker onClose={() => setShowSymptomChecker(false)} />
      )}
      
      {showWaitlist && (
        <WaitlistTracker onClose={() => setShowWaitlist(false)} />
      )}
      
      {showEmergency && (
        <EmergencyBooking onClose={() => setShowEmergency(false)} />
      )}
    </div>
  )
}

export default Home