import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, loading: contextLoading } = useContext(AppContext);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const daysOfWeek = ['SUN','MON','TUE','WED','THU','FRI','SAT'];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchDocInfo = () => {
    // Find doctor in context data
    const docInfo = doctors.find(doc => doc._id === docId || doc.id === docId);
    setDocInfo(docInfo);
    return docInfo;
  };

  const getAvailableSlots = async () => {
    setDocSlots([]); 

    // getting current date
    let today = new Date();

    for (let i = 0; i < 7; i++) {
      // getting date with index
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      // endtime of the date with index
      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      // setting hours
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        timeSlots.push({
          dateTime: new Date(currentDate),
          time: formattedTime
        });
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      setDocSlots(prev => ([
        ...prev,
        timeSlots.length
          ? timeSlots
          : [{ dateTime: new Date(today), time: "No Slots" }]
      ]));
    }
  };

  useEffect(() => {
    if (!contextLoading && doctors.length > 0) {
      const doc = fetchDocInfo();
      if (doc) {
        getAvailableSlots();
      }
    }
  }, [doctors, docId, contextLoading]);

  useEffect(() => {
    // Redirect to login if user is not authenticated
    if (!isAuthenticated) {
      toast.error('Please login to book an appointment');
      navigate('/login');
      return;
    }

    // Check if user is a patient
    const userRole = user?.role;
    if (userRole && userRole !== 'patient') {
      toast.error('Only patients can book appointments');
      navigate('/doctors');
    }
  }, [user, isAuthenticated, navigate]);

  useEffect(() => {
    console.log('Doc slots:', docSlots);
  }, [docSlots]);

  const handleBookAppointment = async () => {
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
      navigate('/doctors');
      return;
    }

    if (!slotTime) {
      toast.error('Please select a time slot');
      return;
    }

    try {
      setLoading(true);
      
      // Make API call to book the appointment
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          doctorId: docInfo._id || docInfo.id,
          appointmentDate: docSlots[slotIndex][0].dateTime.toISOString().split('T')[0],
          appointmentTime: slotTime,
          reason: 'General consultation'
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || 'Appointment booked successfully!');
        // Redirect to appointments page after a short delay
        setTimeout(() => {
          navigate('/my-appointments');
        }, 2000);
      } else {
        // Handle specific error messages from backend
        const errorMessage = data.message || 'Failed to book appointment. Please try again.';
        toast.error(errorMessage);
        
        // If it's an authentication error, redirect to login
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (contextLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show not found if doctor doesn't exist
  if (!docInfo) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Doctor not found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            The requested doctor could not be found.
          </p>
          <button 
            onClick={() => navigate('/doctors')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Browse Doctors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* -------------doc details ----------- */}
        <div className='flex flex-col sm:flex-row gap-4'>
          <div>
            <img className='bg-indigo-400 w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt={docInfo.name} />
          </div>
          <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
            <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
              {docInfo.name} 
              <img className='w-5' src={assets.verified_icon} alt="Verified" />
            </p>
            <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
              <p>{docInfo.speciality || docInfo.specialization}</p>
              <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience} Years</button>
            </div>
            {/* ----doctor about ---- */}
            <div>
              <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
                About 
                <img src={assets.info_icon} alt="Info" />
              </p>
              <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about || 'No information available'}</p>
            </div>
            <p className='text-gray-500 font-medium mt-4'>
              Appointment fee: <span className='text-gray-600'>${docInfo.fees || docInfo.consultationFee || 50}</span>
            </p>
          </div>
        </div>

        {/* --------- Booking Slots -------- */}
        <div className='mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6'>
          <h2 className='text-xl font-bold text-gray-800 dark:text-white mb-4'>Book Appointment</h2>
          <p className='text-gray-600 dark:text-gray-300 mb-6'>Select a date and time slot for your appointment</p>
          
          <div className='font-medium text-gray-700 dark:text-gray-300 mb-4'>
            <p className='mb-2'>Available Dates</p>
            <div className='flex gap-3 items-center w-full overflow-x-scroll pb-2'>
              {docSlots.length > 0 && docSlots.map((item, index) => (
                <div 
                  onClick={() => setSlotIndex(index)} 
                  className={`text-center py-4 min-w-16 rounded-full cursor-pointer transition-all ${
                    slotIndex === index 
                      ? 'bg-blue-500 text-white shadow-lg' 
                      : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`} 
                  key={index}
                >
                  <p className="font-medium">{item[0] && daysOfWeek[item[0].dateTime.getDay()]}</p>
                  <p className="text-lg font-bold">{item[0] && item[0].dateTime.getDate()}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className='font-medium text-gray-700 dark:text-gray-300 mb-6'>
            <p className='mb-2'>Available Time Slots</p>
            <div className='flex items-center gap-3 w-full overflow-x-scroll pb-2'>
              {docSlots.length > 0 && docSlots[slotIndex] && docSlots[slotIndex].map((item, index) => (
                <button
                  onClick={() => setSlotTime(item.time)}
                  className={`text-sm font-medium flex-shrink-0 px-4 py-2 rounded-full transition-all ${
                    item.time === slotTime
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  key={index}
                  disabled={item.time === "No Slots"}
                >
                  {item.time ? item.time.toLowerCase() : "No Slots"}
                </button>
              ))}
            </div>
          </div>
          
          <button 
            onClick={handleBookAppointment}
            disabled={loading || !slotTime}
            className={`w-full md:w-auto px-8 py-3 rounded-full font-medium transition-all ${
              loading || !slotTime
                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {loading ? 'Booking...' : 'Book Appointment'}
          </button>
        </div>

        <RelatedDoctors docId={docId} speciality={docInfo.speciality || docInfo.specialization} />
      </div>
    </div>
  );
};

export default Appointment;