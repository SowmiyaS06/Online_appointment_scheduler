import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaCalendarAlt, 
  FaUserMd, 
  FaUsers, 
  FaChartLine,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaBell,
  FaVideo,
  FaStethoscope,
  FaList,
  FaEye,
  FaPhone
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import AppointmentCalendar from '../components/AppointmentCalendar';
import VideoCall from '../components/VideoCall';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'calendar', 'notifications'
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    confirmedAppointments: 0,
    cancelledAppointments: 0,
    upcomingAppointments: []
  });
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    fetchNotifications();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch appointments data
      const appointmentsResponse = await axios.get('/api/appointments');
      const appointments = appointmentsResponse.data.data.appointments;
      
      const today = new Date().toDateString();
      const todayAppointments = appointments.filter(apt => 
        new Date(apt.appointmentDate).toDateString() === today
      );
      
      const confirmedAppointments = appointments.filter(apt => 
        apt.status === 'confirmed'
      );
      
      const cancelledAppointments = appointments.filter(apt => 
        apt.status === 'cancelled'
      );

      // Get upcoming appointments (next 7 days)
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      const upcomingAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.appointmentDate);
        return aptDate >= new Date() && aptDate <= nextWeek && apt.status !== 'cancelled';
      }).slice(0, 5);

      setStats({
        totalAppointments: appointments.length,
        todayAppointments: todayAppointments.length,
        confirmedAppointments: confirmedAppointments.length,
        cancelledAppointments: cancelledAppointments.length,
        upcomingAppointments
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback to mock data on error
      setStats({
        totalAppointments: 0,
        todayAppointments: 0,
        confirmedAppointments: 0,
        cancelledAppointments: 0,
        upcomingAppointments: []
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      // In a real app, this would come from an API
      const mockNotifications = [
        {
          id: 1,
          title: "Appointment Reminder",
          message: "Your appointment with Dr. Smith is tomorrow at 10:00 AM",
          time: "2 hours ago",
          type: "reminder",
          read: false
        },
        {
          id: 2,
          title: "Appointment Confirmed",
          message: "Your appointment with Dr. Johnson has been confirmed",
          time: "1 day ago",
          type: "confirmation",
          read: true
        },
        {
          id: 3,
          title: "New Doctor Available",
          message: "Dr. Williams specializing in Cardiology has joined our network",
          time: "2 days ago",
          type: "info",
          read: false
        },
        {
          id: 4,
          title: "Teleconsultation Ready",
          message: "Your video call with Dr. Brown is ready to start",
          time: "5 minutes ago",
          type: "teleconsultation",
          read: false
        }
      ];
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? {...notification, read: true} : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({...notification, read: true})));
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <FaCheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <FaTimesCircle className="w-4 h-4 text-red-500" />;
      case 'scheduled':
        return <FaClock className="w-4 h-4 text-blue-500" />;
      default:
        return <FaExclamationTriangle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {getGreeting()}, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Here's what's happening with your healthcare appointments today.
        </p>
      </motion.div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'dashboard'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'calendar'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            Calendar
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'notifications'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <FaBell className="w-4 h-4" />
            Notifications
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card hover className="p-6 rounded-2xl shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Appointments
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stats.totalAppointments}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                    <FaCalendarAlt className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card hover className="p-6 rounded-2xl shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Today's Appointments
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stats.todayAppointments}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
                    <FaClock className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card hover className="p-6 rounded-2xl shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Confirmed
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stats.confirmedAppointments}
                    </p>
                  </div>
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-xl">
                    <FaCheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card hover className="p-6 rounded-2xl shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Cancelled
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stats.cancelledAppointments}
                    </p>
                  </div>
                  <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-xl">
                    <FaTimesCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="p-6 rounded-2xl shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="h-16 flex-col gap-2 rounded-xl"
                  onClick={() => window.location.href = '/doctors'}
                >
                  <FaUserMd className="w-6 h-6" />
                  Find Doctors
                </Button>
                <Button
                  variant="outline"
                  className="h-16 flex-col gap-2 rounded-xl"
                  onClick={() => setActiveTab('calendar')}
                >
                  <FaCalendarAlt className="w-6 h-6" />
                  View Calendar
                </Button>
                <Button
                  variant="outline"
                  className="h-16 flex-col gap-2 rounded-xl"
                  onClick={() => setActiveTab('notifications')}
                >
                  <FaBell className="w-6 h-6" />
                  Notifications
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Upcoming Appointments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="p-6 rounded-2xl shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Upcoming Appointments
                </h2>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => window.location.href = '/my-appointments'}
                >
                  View All
                </Button>
              </div>
              
              {stats.upcomingAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <FaCalendarAlt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No upcoming appointments
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {stats.upcomingAppointments.map((appointment, index) => (
                    <motion.div
                      key={appointment._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                          <FaUserMd className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {appointment.doctor?.name || 'Dr. Unknown'}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {new Date(appointment.appointmentDate).toLocaleDateString()} at{' '}
                            {appointment.appointmentTime}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(appointment.status)}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                        {appointment.status === 'confirmed' && (
                          <Button
                            variant="ghost"
                            size="small"
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setShowVideoCall(true);
                            }}
                            className="p-2"
                          >
                            <FaVideo className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      )}

      {/* Calendar Tab */}
      {activeTab === 'calendar' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <Card className="p-6 rounded-2xl shadow-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Appointment Calendar
              </h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/my-appointments'}
                  className="flex items-center gap-2"
                >
                  <FaList />
                  List View
                </Button>
              </div>
            </div>
            <AppointmentCalendar 
              onSelectEvent={(event) => {
                setSelectedAppointment(event.resource);
                setShowModal(true);
              }}
            />
          </Card>
        </motion.div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <Card className="p-6 rounded-2xl shadow-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Notifications
              </h2>
              <Button
                variant="outline"
                onClick={markAllAsRead}
                disabled={notifications.filter(n => !n.read).length === 0}
              >
                Mark All as Read
              </Button>
            </div>
            
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <FaBell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No notifications yet
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 rounded-xl border ${
                      notification.read 
                        ? 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600' 
                        : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${
                        notification.type === 'reminder' ? 'bg-blue-100 dark:bg-blue-900/30' :
                        notification.type === 'confirmation' ? 'bg-green-100 dark:bg-green-900/30' :
                        notification.type === 'teleconsultation' ? 'bg-purple-100 dark:bg-purple-900/30' :
                        'bg-gray-100 dark:bg-gray-600'
                      }`}>
                        {notification.type === 'reminder' ? <FaBell className="w-5 h-5 text-blue-600 dark:text-blue-400" /> :
                         notification.type === 'confirmation' ? <FaCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" /> :
                         notification.type === 'teleconsultation' ? <FaVideo className="w-5 h-5 text-purple-600 dark:text-purple-400" /> :
                         <FaStethoscope className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {notification.title}
                          </h3>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {notification.time}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">
                          {notification.message}
                        </p>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="small"
                            className="mt-2"
                            onClick={() => markAsRead(notification.id)}
                          >
                            Mark as Read
                          </Button>
                        )}
                        {notification.type === 'teleconsultation' && (
                          <Button
                            variant="primary"
                            size="small"
                            className="mt-2 flex items-center gap-2"
                            onClick={() => setShowVideoCall(true)}
                          >
                            <FaVideo className="w-4 h-4" />
                            Join Call
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      )}

      {/* Appointment Details Modal */}
      {showModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Appointment Details
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FaTimesCircle />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Doctor:</span>
                <p className="text-gray-900 dark:text-white">{selectedAppointment.doctor.name}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Specialization:</span>
                <p className="text-gray-900 dark:text-white">{selectedAppointment.doctor.specialization}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Date & Time:</span>
                <p className="text-gray-900 dark:text-white">
                  {formatDate(selectedAppointment.appointmentDate)} at{' '}
                  {formatTime(selectedAppointment.appointmentTime)}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Status:</span>
                <span
                  className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                    selectedAppointment.status
                  )}`}
                >
                  {selectedAppointment.status}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Reason:</span>
                <p className="text-gray-900 dark:text-white">{selectedAppointment.reason}</p>
              </div>
              {selectedAppointment.notes && (
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Notes:</span>
                  <p className="text-gray-900 dark:text-white">{selectedAppointment.notes}</p>
                </div>
              )}
            </div>
            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowModal(false)}
              >
                Close
              </Button>
              {selectedAppointment.status === 'confirmed' && (
                <Button
                  className="flex-1 flex items-center gap-2"
                  onClick={() => {
                    setShowVideoCall(true);
                    setShowModal(false);
                  }}
                >
                  <FaVideo />
                  Start Call
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Video Call Modal */}
      {showVideoCall && selectedAppointment && (
        <VideoCall 
          appointment={selectedAppointment}
          onClose={() => setShowVideoCall(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;