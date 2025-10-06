import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <footer className='md:mx-10'>
      <div
        className='grid gap-14 my-10 mt-40 text-sm sm:grid'
        style={{ gridTemplateColumns: '3fr 1fr 1fr' }}
      >
        {/* ls */}
        <div>
          <img className='mb-5 w-40' src={assets.logo} alt="MedBook Logo" />
          <p className='w-full md:w-2/3 text-gray-600 leading-6'>
            MedBook is your trusted partner for scheduling and managing medical appointments. Our platform streamlines your healthcare experience, making it easy to book, track, and remember every visit.
          </p>
        </div>
        {/* cs */}
        <div>
          <p className='text-xl font-medium mb-5'>Company</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
          </ul>
        </div>
        {/* rs */}
        <div>
          <p className='text-xl font-medium mb-5'>Get In Touch</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li><a href="tel:+919025363352">+91 9025363352</a></li>
            <li><a href="mailto:medbook0987@gmail.com">medbook0987@gmail.com</a></li>
          </ul>
        </div>
      </div>
      <div>
        <hr />
        <p className='py-5 text-sm text-center'>Copyright 2025 © MedBook - All Rights Reserved</p>
      </div>
    </footer>
  )
}

export default Footer