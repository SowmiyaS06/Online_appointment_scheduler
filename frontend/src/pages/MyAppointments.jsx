import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import AppointmentCalendar from '../components/AppointmentCalendar'
import { FaCalendarAlt, FaList, FaEye, FaTimes, FaCheck } from 'react-icons/fa'

const MyAppointments = () => {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('list') // 'list' or 'calendar'
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/appointments')
      setAppointments(response.data.data.appointments)
    } catch (error) {
      console.error('Error fetching appointments:', error)
      toast.error('Failed to fetch appointments')
    } finally {
      setLoading(false)
    }
  }

  // Function to refresh appointments (to be called after booking)
  const refreshAppointments = () => {
    fetchAppointments()
  }

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await axios.put(`/api/appointments/${appointmentId}/cancel`, {
        cancellationReason: 'Cancelled by patient'
      })
      toast.success('Appointment cancelled successfully')
      fetchAppointments()
    } catch (error) {
      console.error('Error cancelling appointment:', error)
      toast.error('Failed to cancel appointment')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
      })
  }

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Appointments
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage your medical appointments
          </p>
        </div>

        {/* Refresh Button */}
        <div className="mb-4 flex justify-end">
          <button
            onClick={refreshAppointments}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            Refresh Appointments
          </button>
        </div>

        {/* View Toggle */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 w-fit">
            <button
              onClick={() => setView('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                view === 'list'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <FaList />
              List View
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                view === 'calendar'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <FaCalendarAlt />
              Calendar View
            </button>
          </div>
        </div>

        {/* Content */}
        {view === 'list' ? (
          <div className="space-y-6">
            {appointments.length === 0 ? (
              <div className="text-center py-12">
                <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  No appointments
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  You don't have any appointments yet.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => window.location.href = '/doctors'}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Book an Appointment
                  </button>
                </div>
              </div>
            ) : (
              appointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {appointment.doctor.name}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            appointment.status
                          )}`}
                        >
                          {appointment.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                        {appointment.doctor.specialization}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {formatDate(appointment.appointmentDate)} at{' '}
                        {formatTime(appointment.appointmentTime)}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Reason:</span> {appointment.reason}
                      </p>
                      {appointment.notes && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          <span className="font-medium">Notes:</span> {appointment.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row md:flex-col gap-2">
                      <button
                        onClick={() => {
                          setSelectedAppointment(appointment)
                          setShowModal(true)
                        }}
                        className="flex items-center gap-2 px-3 py-1 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-md transition-colors"
                      >
                        <FaEye />
                        View Details
                      </button>
                      {appointment.status === 'scheduled' && (
                        <button
                          onClick={() => handleCancelAppointment(appointment._id)}
                          className="flex items-center gap-2 px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                        >
                          <FaTimes />
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <AppointmentCalendar
            doctorId={user?.role === 'doctor' ? user._id : undefined}
            onSelectEvent={(event) => {
              setSelectedAppointment(event.resource)
              setShowModal(true)
            }}
          />
        )}

        {/* Appointment Details Modal */}
        {showModal && selectedAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Appointment Details
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <FaTimes />
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
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Close
                </button>
                {selectedAppointment.status === 'scheduled' && (
                  <button
                    onClick={() => {
                      handleCancelAppointment(selectedAppointment._id)
                      setShowModal(false)
                    }}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Cancel Appointment
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyAppointments