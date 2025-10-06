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
  FaUser,
  FaHospital,
  FaClipboardList,
  FaChartBar,
  FaCog,
  FaPhone
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import AppointmentCalendar from '../components/AppointmentCalendar';
import VideoCall from '../components/VideoCall';
import axios from 'axios';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'schedule', 'patients', 'reports'
  const [stats, setStats] = useState({
    todayAppointments: 0,
    weeklyPatients: 0,
    missedAppointments: 0,
    completedAppointments: 0,
    upcomingAppointments: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [availability, setAvailability] = useState([
    { day: 'Monday', startTime: '09:00', endTime: '17:00', isAvailable: true },
    { day: 'Tuesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
    { day: 'Wednesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
    { day: 'Thursday', startTime: '09:00', endTime: '17:00', isAvailable: true },
    { day: 'Friday', startTime: '09:00', endTime: '17:00', isAvailable: true },
    { day: 'Saturday', startTime: '10:00', endTime: '14:00', isAvailable: false },
    { day: 'Sunday', startTime: '00:00', endTime: '00:00', isAvailable: false }
  ]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch appointments data for this doctor
      const appointmentsResponse = await axios.get('/api/appointments');
      const appointments = appointmentsResponse.data.data.appointments;
      
      // Get today's appointments
      const today = new Date().toDateString();
      const todayAppointments = appointments.filter(apt => 
        new Date(apt.appointmentDate).toDateString() === today
      );
      
      // Get completed appointments
      const completedAppointments = appointments.filter(apt => 
        apt.status === 'completed'
      );
      
      // Get missed/cancelled appointments
      const missedAppointments = appointments.filter(apt => 
        apt.status === 'cancelled' || apt.status === 'no-show'
      );
      
      // Get weekly unique patients (last 7 days)
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const weeklyPatients = new Set();
      appointments.forEach(apt => {
        const aptDate = new Date(apt.appointmentDate);
        if (aptDate >= oneWeekAgo && aptDate <= new Date()) {
          weeklyPatients.add(apt.patient._id || apt.patient);
        }
      });

      // Get upcoming appointments (next 3)
      const upcomingAppointments = appointments
        .filter(apt => {
          const aptDate = new Date(apt.appointmentDate);
          return aptDate >= new Date() && apt.status !== 'cancelled';
        })
        .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
        .slice(0, 3);

      setStats({
        todayAppointments: todayAppointments.length,
        weeklyPatients: weeklyPatients.size,
        missedAppointments: missedAppointments.length,
        completedAppointments: completedAppointments.length,
        upcomingAppointments
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback to mock data on error
      setStats({
        todayAppointments: 0,
        weeklyPatients: 0,
        missedAppointments: 0,
        completedAppointments: 0,
        upcomingAppointments: []
      });
    } finally {
      setLoading(false);
    }
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

  const toggleAvailability = (index) => {
    const updatedAvailability = [...availability];
    updatedAvailability[index].isAvailable = !updatedAvailability[index].isAvailable;
    setAvailability(updatedAvailability);
  };

  const updateAvailabilityTime = (index, field, value) => {
    const updatedAvailability = [...availability];
    updatedAvailability[index][field] = value;
    setAvailability(updatedAvailability);
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
          Good Morning, Dr. {user?.name?.split(' ')[1] || user?.name}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Here's your schedule and patient appointments for today.
        </p>
      </motion.div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'dashboard'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <FaChartLine />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'schedule'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <FaCalendarAlt />
            Schedule
          </button>
          <button
            onClick={() => setActiveTab('patients')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'patients'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <FaUsers />
            Patients
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'reports'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <FaChartBar />
            Reports
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
                      Today's Appointments
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stats.todayAppointments}
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
                      Weekly Patients
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stats.weeklyPatients}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
                    <FaUser className="w-6 h-6 text-green-600 dark:text-green-400" />
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
                      Completed
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stats.completedAppointments}
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
                      Missed/Cancelled
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stats.missedAppointments}
                    </p>
                  </div>
                  <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-xl">
                    <FaTimesCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Upcoming Appointments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="p-6 rounded-2xl shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Upcoming Appointments
                </h2>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => setActiveTab('schedule')}
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
                          <FaUser className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {appointment.patient?.name || 'Unknown Patient'}
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
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      )}

      {/* Schedule Tab */}
      {activeTab === 'schedule' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <Card className="p-6 rounded-2xl shadow-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Appointment Schedule
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
              doctorId={user?._id}
              onSelectEvent={(event) => {
                setSelectedAppointment(event.resource);
                setShowModal(true);
              }}
            />
          </Card>
        </motion.div>
      )}

      {/* Patients Tab */}
      {activeTab === 'patients' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <Card className="p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Patient Management
            </h2>
            <div className="text-center py-12">
              <FaUser className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Patient management features coming soon
              </p>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <Card className="p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Reports & Analytics
            </h2>
            <div className="text-center py-12">
              <FaChartBar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Detailed reports and analytics coming soon
              </p>
            </div>
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
                <span className="font-medium text-gray-700 dark:text-gray-300">Patient:</span>
                <p className="text-gray-900 dark:text-white">{selectedAppointment.patient.name}</p>
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

export default DoctorDashboard;