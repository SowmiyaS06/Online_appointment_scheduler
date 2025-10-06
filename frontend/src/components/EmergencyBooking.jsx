import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaAmbulance, FaUserMd, FaPhone, FaMapMarkerAlt, FaTimes, FaCheck } from 'react-icons/fa';
import Card from './Card';
import Button from './Button';

const EmergencyBooking = ({ onClose }) => {
  const [step, setStep] = useState(1); // 1: Reason, 2: Location, 3: Confirmation, 4: Success
  const [reason, setReason] = useState('');
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState('');
  const [bookingId, setBookingId] = useState('');

  const handleConfirm = () => {
    // Mock booking confirmation
    setBookingId('EMER-' + Math.floor(100000 + Math.random() * 900000));
    setStep(4);
  };

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
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <FaAmbulance className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Emergency Booking
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FaTimes className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Step 1: Reason for Emergency */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  What's your emergency?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Please briefly describe your situation
                </p>
              </div>

              <div className="space-y-3">
                {[
                  'Chest Pain',
                  'Difficulty Breathing',
                  'Severe Injury',
                  'High Fever',
                  'Allergic Reaction',
                  'Other'
                ].map((option) => (
                  <button
                    key={option}
                    onClick={() => setReason(option)}
                    className={`w-full p-4 text-left rounded-xl transition-all ${
                      reason === option
                        ? 'bg-red-500 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {reason === 'Other' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Describe your emergency
                  </label>
                  <textarea
                    value={reason === 'Other' ? '' : reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Please describe your emergency..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              )}

              <Button
                onClick={() => setStep(2)}
                disabled={!reason}
                className="w-full flex items-center justify-center gap-2"
              >
                Continue
                <FaPhone className="w-4 h-4" />
              </Button>
            </motion.div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Your Location
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Where should we send help?
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter your address..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contact Number
                </label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Enter your phone number..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!location || !contact}
                  className="flex-1"
                >
                  Confirm
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Confirm Emergency Request
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Please review your information before submitting
                </p>
              </div>

              <Card className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Emergency:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{reason}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Location:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Contact:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{contact}</span>
                  </div>
                </div>
              </Card>

              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <FaAmbulance className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-red-800 dark:text-red-200">
                      Emergency Response
                    </div>
                    <div className="text-sm text-red-700 dark:text-red-300">
                      By submitting, you confirm this is a medical emergency requiring immediate attention.
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleConfirm}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <FaAmbulance className="w-4 h-4" />
                  Submit Request
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 text-center"
            >
              <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-xl">
                <FaCheck className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Request Submitted!
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Emergency services have been notified. Help is on the way.
                </p>
              </div>

              <Card className="p-4">
                <div className="text-center">
                  <div className="font-medium text-gray-900 dark:text-white mb-1">
                    Booking ID
                  </div>
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {bookingId}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                    Please keep this ID for reference
                  </div>
                </div>
              </Card>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <FaPhone className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-blue-800 dark:text-blue-200">
                      What to Expect
                    </div>
                    <div className="text-sm text-blue-700 dark:text-blue-300">
                      Emergency services will contact you within 5 minutes. 
                      Please stay calm and stay at the provided location.
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={onClose}
                className="w-full"
              >
                Close
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default EmergencyBooking;