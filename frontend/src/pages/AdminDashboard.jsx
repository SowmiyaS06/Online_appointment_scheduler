import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

const AdminDashboard = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    appointmentsToday: 0,
    revenue: 0,
    totalAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [systemHealth, setSystemHealth] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all required data in parallel
      const [usersResponse, appointmentsResponse] = await Promise.all([
        axios.get('/api/users'),
        axios.get('/api/appointments')
      ]);

      // Process users data
      const users = usersResponse.data.data.users || usersResponse.data.data;
      const patients = users.filter(user => user.role === 'patient');
      const doctors = users.filter(user => user.role === 'doctor');
      const admins = users.filter(user => user.role === 'admin');

      // Process appointments data
      const appointments = appointmentsResponse.data.data.appointments || appointmentsResponse.data.data;
      const today = new Date().toDateString();
      const todayAppointments = appointments.filter(apt => 
        new Date(apt.appointmentDate).toDateString() === today
      );
      
      const upcomingAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.appointmentDate);
        return aptDate >= new Date() && apt.status !== 'cancelled' && apt.status !== 'completed';
      });
      
      const completedAppointments = appointments.filter(apt => 
        apt.status === 'completed'
      );
      
      const cancelledAppointments = appointments.filter(apt => 
        apt.status === 'cancelled'
      );

      // Calculate revenue (assuming $50 per appointment)
      const revenue = appointments.length * 50;

      // Update state
      setStats({
        totalPatients: patients.length,
        totalDoctors: doctors.length,
        appointmentsToday: todayAppointments.length,
        revenue: revenue,
        totalAppointments: appointments.length,
        upcomingAppointments: upcomingAppointments.length,
        completedAppointments: completedAppointments.length,
        cancelledAppointments: cancelledAppointments.length
      });

      setPatients(patients);
      setDoctors(doctors);
      setAdmins(admins);
      setAppointments(appointments);

      // Recent activities - in a real app, this would come from an API
      setRecentActivities([
        {
          id: 1,
          user: doctors.length > 0 ? doctors[0].name : 'Dr. Sarah Johnson',
          action: 'Added new availability slots',
          time: '2 minutes ago'
        },
        {
          id: 2,
          user: patients.length > 0 ? patients[0].name : 'John Smith',
          action: 'Booked appointment',
          time: '15 minutes ago'
        },
        {
          id: 3,
          user: 'Admin Team',
          action: 'Updated system configuration',
          time: '1 hour ago'
        },
        {
          id: 4,
          user: patients.length > 1 ? patients[1].name : 'Emily Johnson',
          action: 'Uploaded medical reports',
          time: '2 hours ago'
        }
      ]);

      // System health data
      setSystemHealth([
        { name: 'Database', status: 'Operational', uptime: '99.9%' },
        { name: 'API Server', status: 'Operational', uptime: '99.8%' },
        { name: 'Frontend', status: 'Operational', uptime: '100%' },
        { name: 'Email Service', status: 'Degraded', uptime: '95.2%' }
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback to mock data on error
      setStats({
        totalPatients: 1248,
        totalDoctors: 86,
        appointmentsToday: 142,
        revenue: 12480,
        totalAppointments: 0,
        upcomingAppointments: 0,
        completedAppointments: 0,
        cancelledAppointments: 0
      });
    } finally {
      setLoading(false);
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
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">System overview and management</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Total Patients</p>
            <div className="flex items-baseline mt-2">
              <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.totalPatients}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Total Doctors</p>
            <div className="flex items-baseline mt-2">
              <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.totalDoctors}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Appointments Today</p>
            <div className="flex items-baseline mt-2">
              <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.appointmentsToday}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Revenue</p>
            <div className="flex items-baseline mt-2">
              <p className="text-3xl font-bold text-gray-800 dark:text-white">${stats.revenue}</p>
            </div>
          </div>
        </div>

        {/* Additional Stats for Appointments */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Total Appointments</p>
            <div className="flex items-baseline mt-2">
              <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.totalAppointments}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Upcoming</p>
            <div className="flex items-baseline mt-2">
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.upcomingAppointments}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Completed</p>
            <div className="flex items-baseline mt-2">
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.completedAppointments}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Cancelled</p>
            <div className="flex items-baseline mt-2">
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.cancelledAppointments}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8">
          <button
            className={`py-3 px-6 font-medium text-sm ${activeTab === 'overview' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`py-3 px-6 font-medium text-sm ${activeTab === 'users' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('users')}
          >
            User Management
          </button>
          <button
            className={`py-3 px-6 font-medium text-sm ${activeTab === 'appointments' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('appointments')}
          >
            Appointments
          </button>
          <button
            className={`py-3 px-6 font-medium text-sm ${activeTab === 'system' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('system')}
          >
            System Health
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activities */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Recent Activities</h2>
                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start border-b border-gray-100 dark:border-gray-800 pb-4 last:border-0 last:pb-0">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        {activity.user.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 dark:text-white font-medium">{activity.user}</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{activity.action}</p>
                      <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Quick Stats</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">New Patients (This Week)</span>
                  <span className="font-semibold text-gray-800 dark:text-white">24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Active Doctors</span>
                  <span className="font-semibold text-gray-800 dark:text-white">{doctors.filter(d => d.isActive).length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Avg. Appointment Duration</span>
                  <span className="font-semibold text-gray-800 dark:text-white">30 min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Patient Satisfaction</span>
                  <span className="font-semibold text-gray-800 dark:text-white">4.8/5</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Management Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Patients */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Patients</h2>
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                    {patients.length}
                  </span>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {patients.slice(0, 10).map((patient) => (
                    <div key={patient._id} className="flex items-center py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                      <div className="bg-gray-200 dark:bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                        <span className="text-gray-700 dark:text-gray-300 text-xs">
                          {patient.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                          {patient.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                          {patient.email}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                        patient.isActive 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {patient.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Doctors */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Doctors</h2>
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                    {doctors.length}
                  </span>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {doctors.slice(0, 10).map((doctor) => (
                    <div key={doctor._id} className="flex items-center py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                      <div className="bg-gray-200 dark:bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                        <span className="text-gray-700 dark:text-gray-300 text-xs">
                          {doctor.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                          {doctor.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                          {doctor.specialization}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                        doctor.isActive 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {doctor.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Admins */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Admins</h2>
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                    {admins.length}
                  </span>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {admins.slice(0, 10).map((admin) => (
                    <div key={admin._id} className="flex items-center py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                      <div className="bg-gray-200 dark:bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                        <span className="text-gray-700 dark:text-gray-300 text-xs">
                          {admin.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                          {admin.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                          {admin.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">All Appointments</h2>
              <div className="flex gap-2">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600">
                  Export
                </button>
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700">
                  Add Appointment
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      Patient
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      Doctor
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      Date & Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      Reason
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {appointments.map((appointment) => (
                    <tr key={appointment._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center">
                              <span className="text-gray-700 text-sm">
                                {appointment.patient?.name?.charAt(0) || 'P'}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {appointment.patient?.name || 'Unknown Patient'}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {appointment.patient?.email || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center">
                              <span className="text-gray-700 text-sm">
                                {appointment.doctor?.name?.charAt(0) || 'D'}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {appointment.doctor?.name || 'Unknown Doctor'}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {appointment.doctor?.specialization || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {formatDate(appointment.appointmentDate)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {formatTime(appointment.appointmentTime)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {appointment.reason}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {appointments.length === 0 && (
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 text-gray-400">
                  <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No appointments</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  There are no appointments to display.
                </p>
              </div>
            )}
          </div>
        )}

        {/* System Health Tab */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">System Health</h2>
              <div className="space-y-4">
                {systemHealth.map((service) => (
                  <div key={service.name} className="flex items-center justify-between py-3">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 w-3 h-3 rounded-full ${
                        service.status === 'Operational' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{service.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        service.status === 'Operational' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                      }`}>
                        {service.status}
                      </span>
                      <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">{service.uptime} uptime</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;