import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const RelatedDoctors = ({ speciality, docId }) => {
    const { doctors } = useContext(AppContext);
    const [relDoc, setRelDocs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (doctors.length > 0 && speciality) {
            const doctorsData = doctors.filter((doc) => 
                (doc.speciality === speciality || doc.specialization === speciality) && 
                (doc._id !== docId && doc.id !== docId)
            );
            setRelDocs(doctorsData);
        }
    }, [doctors, speciality, docId]);

    if (relDoc.length === 0) {
        return null;
    }

    return (
        <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
            <h1 className='text-3xl font-medium'>Related Doctors available</h1>
            <p className='sm:w-1/3 text-center text-sm'>Simply browse through our extensive list of trusted doctors.</p>
            <div
                className="w-full grid gap-4 pt-5 gap-y-6 px-3 sm:px-0"
                style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}
            >
                {relDoc.slice(0, 5).map((item, index) => (
                    <div 
                        onClick={() => navigate(`/appointments/${item._id || item.id}`)} 
                        className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px]' 
                        key={item._id || item.id || index}
                    >
                        <img 
                            className='bg-blue-50 w-full h-48 object-cover' 
                            src={item.image} 
                            alt={item.name}
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/300x300.png?text=Doctor+Image';
                            }}
                        />
                        <div className='p-4'>
                            <div className='flex items-center gap-2 text-sm text-center text-green-500'>
                                <p className='w-2 h-2 bg-green-500 rounded-full'></p>
                                <p>Available</p>
                            </div>
                            <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                            <p className='text-gray-600 text-sm'>{item.speciality || item.specialization}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button 
                onClick={() => navigate('/doctors')} 
                className='bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10 hover:bg-blue-100 transition-colors'
            >
                More Doctors
            </button>
        </div>
    );
};

export default RelatedDoctors;