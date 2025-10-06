import React from 'react'
import { assets } from '../assets/assets'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const About = () => {
  return (
    <div>
      <Navbar />
      <div className='text-center text-2xl pt-24 text-gray-500'>
        <p>About <span className='text-gray-700 font-medium'>Us</span></p>
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-12 px-4'>
        <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
          <p>At MedBook, we believe that healthcare should be simple, accessible, and stress-free. Our platform is designed to bridge the gap between patients and doctors by offering an easy way to browse, compare, and book trusted healthcare professionals across various specialties.
            Whether it's for a routine check-up, a consultation, or specialized care, MedBook ensures that patients can connect with the right doctors at the right time.</p>
          <p>We understand that time and clarity are crucial when it comes to health. That's why MedBook provides real-time doctor availability, instant booking options, and a transparent view of each doctor's profile, experience, and specialization. 
            By putting all this information at your fingertips, we help patients make informed choices while saving valuable time.</p>
          <b className='text-gray-800'>Our Vision</b>
          <p>At MedBook, our vision is to revolutionize healthcare accessibility by creating a trusted digital platform where patients can seamlessly connect with doctors anytime, anywhere.
            We aim to empower individuals to take charge of their health through easy appointment booking, reliable doctor insights, and a transparent, user-friendly experience, ultimately building healthier communities driven by trust, convenience, and care.</p>
        </div>
      </div>
      <div className='text-xl my-4 px-4'>
        <p>Why <span className='text-gray-700 font-semibold'>Choose Us</span></p>
      </div>
      <div className='flex flex-col md:flex-row mb-20 px-4'>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-indigo-400 hover:text-white transition-all duration-300 text-gray-700 cursor-pointer'>
          <b>Efficiency:</b>
          <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-indigo-400 hover:text-white transition-all duration-300 text-gray-700 cursor-pointer'>
          <b>Convenience:</b>
          <p>Access to a network of trusted healthcare professionals in your area.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-indigo-400 hover:text-white transition-all duration-300 text-gray-700 cursor-pointer'>
          <b>Personalization:</b>
          <p>Tailored recommendations and reminders to help you stay on top of your health.</p>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default About