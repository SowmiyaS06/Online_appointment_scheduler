import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUserClock, FaUserMd, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import Card from './Card';
import Button from './Button';

const WaitlistTracker = ({ onClose }) => {
  const [queuePosition, setQueuePosition] = useState(5);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState(25);
  const [status, setStatus] = useState('waiting'); // 'waiting', 'called', 'missed'
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    // Mock data for demonstration
    const mockDoctors = [
      { id: 1, name: 'Dr. John Smith', specialization: 'General Physician', available: true, nextAvailable: '2:30 PM' },
      { id: 2, name: 'Dr. Sarah Johnson', specialization: 'Dermatologist', available: false, nextAvailable: '3:15 PM' },
      { id: 3, name: 'Dr. Michael Williams', specialization: 'Pediatrician', available: true, nextAvailable: '2:45 PM' }
    ];
    setDoctors(mockDoctors);
    
    // Simulate queue movement
    const interval = setInterval(() => {
      setQueuePosition(prev => Math.max(1, prev - 1));
      setEstimatedWaitTime(prev => Math.max(0, prev - 5));
      
      // Simulate being called
      if (queuePosition === 1 && estimatedWaitTime <= 5) {
        setStatus('called');
      }
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, [queuePosition, estimatedWaitTime]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <FaUserClock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Waitlist Tracker
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FaTimesCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {status === 'waiting' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Queue Position */}
              <Card className="p-6 text-center">
                <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {queuePosition}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  People ahead of you
                </div>
              </Card>

              {/* Estimated Wait Time */}
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      Estimated Wait Time
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {estimatedWaitTime} minutes
                    </div>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <FaClock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </Card>

              {/* Status */}
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                    <FaUserClock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      You're on the waitlist
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      We'll notify you when it's your turn
                    </div>
                  </div>
                </div>
              </Card>

              {/* Available Doctors */}
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                  Available Doctors
                </h3>
                <div className="space-y-3">
                  {doctors.filter(doc => doc.available).map((doctor) => (
                    <Card key={doctor.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {doctor.name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {doctor.specialization}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-green-600 dark:text-green-400">
                            Available
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Next: {doctor.nextAvailable}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                onClick={onClose}
                className="w-full"
              >
                Close
              </Button>
            </motion.div>
          )}

          {status === 'called' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 text-center"
            >
              <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-xl">
                <FaCheckCircle className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Your turn is here!
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Please proceed to Room 3 for your consultation with Dr. Smith
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                >
                  Later
                </Button>
                <Button
                  onClick={() => {
                    alert('Navigating to consultation room...');
                    onClose();
                  }}
                >
                  I'm Here
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default WaitlistTracker;