import React from 'react'
import { assets } from '../assets/assets'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Contact = () => {
  return (
    <div>
      <Navbar />
      <div className='text-center text-2xl pt-24 text-gray-500'>
        <p>CONTACT <span className='text-gray-700 font-semibold'>US</span></p>
      </div>
      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm px-4'>
        <img className='w-full md:max-w-[360px]' src={assets.contact_image} alt="" />
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-lg text-gray-600'>Our Office</p>
          <p className='text-gray-500'>123, 4th Floor, Sunrise Medical Complex, <br/>MG Road, Indiranagar,<br/>Bengaluru – 560038, Karnataka, India.</p>
          <p className='text-gray-500'>📞 +91 90253 63352<br/>📧 support@medbook.in</p>
          <p className='font-semibold text-lg text-gray-600'>Careers At MedBook</p>
          <p className='text-gray-500'>Learn more about our teams and job openings.</p>
          <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>Explore Jobs</button>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Contact