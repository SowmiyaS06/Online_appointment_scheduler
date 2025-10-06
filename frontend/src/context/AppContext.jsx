import { createContext, useState, useEffect } from "react";
import { doctors } from "../assets/assets";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
    const [doctorsData, setDoctorsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const currencySymbol = '$';

    // Fetch doctors from backend
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                setLoading(true);
                // First try to fetch from backend
                const response = await fetch('/api/users/doctors');
                if (response.ok) {
                    const data = await response.json();
                    console.log('Backend response:', data); // Debug log
                    // Ensure we're getting the doctors array correctly
                    let doctorsList = data.data?.doctors || data.data || data || doctors;
                    
                    // If we have an array of doctors, use it directly
                    // If we have an object with a doctors property, use that
                    if (Array.isArray(doctorsList)) {
                        console.log('Using array of doctors from backend:', doctorsList);
                        // Ensure all doctors have image data by matching with static data
                        const enhancedDoctors = doctorsList.map((doctor, index) => {
                            // If doctor doesn't have an image, use fallback
                            if (!doctor.image) {
                                console.log(`Doctor ${index} missing image, using fallback`);
                                // Find matching doctor in static data by name or id
                                const staticDoctor = doctors.find(d => 
                                    d._id === doctor._id || d.name === doctor.name
                                );
                                if (staticDoctor) {
                                    return { ...doctor, image: staticDoctor.image };
                                }
                            }
                            return doctor;
                        });
                        setDoctorsData(enhancedDoctors);
                    } else if (doctorsList.doctors && Array.isArray(doctorsList.doctors)) {
                        console.log('Using doctors.doctors from backend:', doctorsList.doctors);
                        // Ensure all doctors have image data by matching with static data
                        const enhancedDoctors = doctorsList.doctors.map((doctor, index) => {
                            // If doctor doesn't have an image, use fallback
                            if (!doctor.image) {
                                console.log(`Doctor ${index} missing image, using fallback`);
                                // Find matching doctor in static data by name or id
                                const staticDoctor = doctors.find(d => 
                                    d._id === doctor._id || d.name === doctor.name
                                );
                                if (staticDoctor) {
                                    return { ...doctor, image: staticDoctor.image };
                                }
                            }
                            return doctor;
                        });
                        setDoctorsData(enhancedDoctors);
                    } else {
                        console.warn('Unexpected doctors data format, using static data');
                        setDoctorsData(doctors);
                    }
                } else {
                    console.warn('Failed to fetch doctors from backend, using static data');
                    setDoctorsData(doctors);
                }
            } catch (error) {
                console.error('Error fetching doctors:', error);
                // Fallback to static data if backend fails
                setDoctorsData(doctors);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    const value = {
        doctors: doctorsData,
        currencySymbol,
        loading
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;