import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaStar, FaUserMd, FaFilter } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets'; // Import assets
import { doctors as staticDoctors } from '../assets/assets'; // Import static doctors data
import { toast } from 'react-toastify';
import Card from '../components/Card';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Doctors = () => {
  const { speciality } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { doctors, loading: contextLoading } = useContext(AppContext);
  const navigate = useNavigate();
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState(speciality || 'All');

  const specialties = [
    'All',
    'General Physician',
    'Cardiologist',
    'Dermatologist',
    'Gynecologist',
    'Pediatrician',
    'Neurologist',
    'Gastroenterologist',
    'Orthopedist',
    'Psychiatrist'
  ];

  useEffect(() => {
    console.log('Doctors data:', doctors); // Debug log
    // Log each doctor to see image properties
    doctors.forEach((doctor, index) => {
      console.log(`Doctor ${index} image:`, doctor.image);
    });
    filterDoctors();
  }, [doctors, searchTerm, selectedSpecialty]);

  const filterDoctors = () => {
    let filtered = doctors;

    // Filter by specialty
    if (selectedSpecialty !== 'All') {
      filtered = filtered.filter(doctor => 
        (doctor.speciality || doctor.specialization)?.toLowerCase().includes(selectedSpecialty.toLowerCase())
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(doctor =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doctor.speciality || doctor.specialization)?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredDoctors(filtered);
  };

  const handleSpecialtyChange = (specialty) => {
    setSelectedSpecialty(specialty);
    if (specialty === 'All') {
      navigate('/doctors');
    } else {
      navigate(`/doctors/${specialty}`);
    }
  };

  // Function to get fallback image for a doctor
  const getFallbackImage = (doctor) => {
    const staticDoctor = staticDoctors.find(d => 
      d._id === doctor._id || d.name === doctor.name
    );
    return staticDoctor ? staticDoctor.image : 'https://via.placeholder.com/300x300.png?text=Doctor+Image';
  };

  // Handle book now button click
  const handleBookNow = (doctorId) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.error('Please login to book an appointment');
      navigate('/login');
      return;
    }

    // Check if user is a patient with a more robust fallback mechanism
    let userRole = user?.role;
    
    // If role is not available in context, try to get it from localStorage
    if (!userRole) {
      try {
        const localStorageUser = localStorage.getItem('user');
        if (localStorageUser) {
          const parsedUser = JSON.parse(localStorageUser);
          userRole = parsedUser?.role;
        }
      } catch (error) {
        console.error('Error parsing localStorage user:', error);
      }
    }
    
    // Default to patient if no role is found
    userRole = userRole || 'patient';
    
    if (userRole !== 'patient') {
      toast.error('You must log in as a patient to book an appointment');
      return;
    }

    // Navigate to appointment page
    navigate(`/appointments/${doctorId}`);
  };

  if (contextLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Find Your Doctor
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Browse through our network of qualified healthcare professionals
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search doctors by name or specialty..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Specialty Filter */}
                <div className="lg:w-64">
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => handleSpecialtyChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    {specialties.map(specialty => (
                      <option key={specialty} value={specialty}>
                        {specialty}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Specialty Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex flex-wrap gap-2">
              {specialties.map((specialty) => (
                <button
                  key={specialty}
                  onClick={() => handleSpecialtyChange(specialty)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedSpecialty === specialty
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {specialty}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Results Count */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p className="text-gray-600 dark:text-gray-300">
              {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''} found
              {selectedSpecialty !== 'All' && ` in ${selectedSpecialty}`}
            </p>
          </motion.div>

          {/* Doctors Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredDoctors.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <FaUserMd className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No doctors found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Try adjusting your search criteria
                </p>
                <Button onClick={() => {
                  setSearchTerm('');
                  setSelectedSpecialty('All');
                }}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              filteredDoctors.map((doctor) => (
                <motion.div
                  key={doctor._id || doctor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="overflow-hidden h-full flex flex-col">
                    <div className="relative">
                      <img 
                        src={doctor.image || getFallbackImage(doctor)} 
                        alt={doctor.name} 
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          // If the image fails to load, use fallback
                          console.log(`Failed to load image for doctor: ${doctor.name}`);
                          e.target.src = getFallbackImage(doctor);
                        }}
                      />
                      <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg">
                        <FaStar className="text-yellow-400" />
                      </div>
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {doctor.name}
                        </h3>
                        <img 
                          src={assets.verified_icon} 
                          alt="Verified" 
                          className="w-5 h-5" 
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-1">
                        {doctor.speciality || doctor.specialization || 'General Physician'}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
                        {doctor.degree || 'MBBS'} • {doctor.experience || '0'} Years
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-grow">
                        {doctor.about ? doctor.about.substring(0, 100) + '...' : 'No information available'}
                      </p>
                      <div className="flex justify-between items-center mt-auto">
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          ${doctor.fees || doctor.consultationFee || 50}
                          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/visit</span>
                        </p>
                        <Button 
                          onClick={() => handleBookNow(doctor._id || doctor.id)}
                          size="small"
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Doctors;