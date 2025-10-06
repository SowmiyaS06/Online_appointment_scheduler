import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaStethoscope, FaClipboardList, FaUserMd, FaArrowRight, FaTimes } from 'react-icons/fa';
import Card from './Card';
import Button from './Button';

const AISymptomChecker = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [severity, setSeverity] = useState('');
  const [duration, setDuration] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [results, setResults] = useState(null);

  const commonSymptoms = [
    'Headache', 'Fever', 'Cough', 'Fatigue', 'Nausea', 
    'Chest Pain', 'Shortness of Breath', 'Abdominal Pain', 
    'Joint Pain', 'Skin Rash', 'Dizziness', 'Sore Throat'
  ];

  const handleAddSymptom = () => {
    if (selectedSymptom && severity && duration) {
      setSymptoms([...symptoms, { symptom: selectedSymptom, severity, duration }]);
      setSelectedSymptom('');
      setSeverity('');
      setDuration('');
    }
  };

  const handleRemoveSymptom = (index) => {
    setSymptoms(symptoms.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    // Mock AI analysis - in a real app, this would call an API
    const mockResults = {
      urgency: symptoms.some(s => s.severity === 'Severe') ? 'High' : 
               symptoms.some(s => s.severity === 'Moderate') ? 'Medium' : 'Low',
      possibleConditions: [
        'Common Cold',
        'Seasonal Allergies',
        'Viral Infection'
      ],
      recommendations: [
        'Rest and stay hydrated',
        'Monitor symptoms for 24-48 hours',
        'Consider over-the-counter medications for symptom relief'
      ],
      whenToSeekCare: symptoms.some(s => s.severity === 'Severe') ? 
        'Seek immediate medical attention if symptoms worsen' : 
        'Contact your doctor if symptoms persist beyond a few days'
    };
    
    setResults(mockResults);
    setCurrentStep(3);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <FaStethoscope className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                AI Symptom Checker
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FaTimes className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-4 mb-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === step 
                    ? 'bg-blue-500 text-white' 
                    : currentStep > step 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 ${
                    currentStep > step 
                      ? 'bg-green-500' 
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}></div>
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Symptom Selection */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  What symptoms are you experiencing?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Select from common symptoms or add your own
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {commonSymptoms.map((symptom) => (
                  <button
                    key={symptom}
                    onClick={() => setSelectedSymptom(symptom)}
                    className={`p-3 rounded-xl text-center transition-all ${
                      selectedSymptom === symptom
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {symptom}
                  </button>
                ))}
              </div>

              <div className="pt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Or enter your symptom
                </label>
                <input
                  type="text"
                  value={selectedSymptom}
                  onChange={(e) => setSelectedSymptom(e.target.value)}
                  placeholder="Describe your symptom..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => setCurrentStep(2)}
                  disabled={!selectedSymptom}
                  className="flex-1"
                >
                  Continue
                  <FaArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Symptom Details */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Symptom Details
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Please provide more information about your symptom
                </p>
              </div>

              <Card className="p-4">
                <div className="font-medium text-gray-900 dark:text-white">
                  {selectedSymptom}
                </div>
              </Card>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Severity
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['Mild', 'Moderate', 'Severe'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setSeverity(level)}
                      className={`p-3 rounded-xl text-center transition-all ${
                        severity === level
                          ? level === 'Mild' 
                            ? 'bg-green-500 text-white' 
                            : level === 'Moderate' 
                              ? 'bg-yellow-500 text-white' 
                              : 'bg-red-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Duration
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select duration</option>
                  <option value="Less than a day">Less than a day</option>
                  <option value="1-3 days">1-3 days</option>
                  <option value="3-7 days">3-7 days</option>
                  <option value="More than a week">More than a week</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional Information (Optional)
                </label>
                <textarea
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder="Any other details about your symptoms..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                >
                  Back
                </Button>
                <Button
                  onClick={handleAddSymptom}
                  className="flex-1"
                >
                  Add Symptom
                </Button>
              </div>

              {/* Added Symptoms */}
              {symptoms.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Added Symptoms
                  </h4>
                  <div className="space-y-3">
                    {symptoms.map((symptom, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {symptom.symptom}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {symptom.severity} • {symptom.duration}
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveSymptom(index)}
                          className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                        >
                          <FaTimes className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={symptoms.length === 0}
                  className="flex-1"
                >
                  Get Analysis
                  <FaArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Results */}
          {currentStep === 3 && results && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Symptom Analysis Results
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Based on your symptoms, here's what our AI suggests
                </p>
              </div>

              {/* Urgency Level */}
              <Card className="p-4 border-l-4 border-blue-500">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    results.urgency === 'High' 
                      ? 'bg-red-100 dark:bg-red-900/20' 
                      : results.urgency === 'Medium' 
                        ? 'bg-yellow-100 dark:bg-yellow-900/20' 
                        : 'bg-green-100 dark:bg-green-900/20'
                  }`}>
                    <FaClipboardList className={`w-5 h-5 ${
                      results.urgency === 'High' 
                        ? 'text-red-600 dark:text-red-400' 
                        : results.urgency === 'Medium' 
                          ? 'text-yellow-600 dark:text-yellow-400' 
                          : 'text-green-600 dark:text-green-400'
                    }`} />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      Urgency Level: {results.urgency}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {results.whenToSeekCare}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Possible Conditions */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  Possible Conditions
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {results.possibleConditions.map((condition, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                          <FaStethoscope className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {condition}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  Recommendations
                </h4>
                <ul className="space-y-2">
                  {results.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="mt-1 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700 dark:text-gray-300">
                        {recommendation}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentStep(1);
                    setSymptoms([]);
                    setResults(null);
                  }}
                  className="flex-1"
                >
                  Check Again
                </Button>
                <Button
                  onClick={() => {
                    // In a real app, this would navigate to doctor booking
                    alert('Redirecting to doctor booking...');
                    onClose();
                  }}
                  className="flex-1 flex items-center gap-2"
                >
                  <FaUserMd className="w-4 h-4" />
                  Book a Doctor
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AISymptomChecker;