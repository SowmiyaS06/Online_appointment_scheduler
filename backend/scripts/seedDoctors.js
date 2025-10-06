const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('../models/User');

// Doctor data from frontend assets.js
const doctorsData = [
  {
    name: 'Dr. Richard James',
    email: 'richard.james@medbook.com',
    password: 'doctor123',
    role: 'doctor',
    specialization: 'General physician',
    degree: 'MBBS',
    experience: 4,
    about: 'Dr. James has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
    consultationFee: 50,
    address: {
      line1: '17th Cross, Richmond',
      line2: 'Circle, Ring Road, London'
    },
    profilePic: '/api/assets/doc1.png',
    isActive: true
  },
  {
    name: 'Dr. Emily Larson',
    email: 'emily.larson@medbook.com',
    password: 'doctor123',
    role: 'doctor',
    specialization: 'Gynecologist',
    degree: 'MBBS',
    experience: 3,
    about: 'Dr. Larson specializes in women\'s health with a focus on preventive care and comprehensive treatment.',
    consultationFee: 60,
    address: {
      line1: '27th Cross, Richmond',
      line2: 'Circle, Ring Road, London'
    },
    profilePic: '/api/assets/doc2.png',
    isActive: true
  },
  {
    name: 'Dr. Sarah Patel',
    email: 'sarah.patel@medbook.com',
    password: 'doctor123',
    role: 'doctor',
    specialization: 'Dermatologist',
    degree: 'MBBS',
    experience: 1,
    about: 'Dr. Patel is an expert in skin health and dermatological treatments.',
    consultationFee: 30,
    address: {
      line1: '37th Cross, Richmond',
      line2: 'Circle, Ring Road, London'
    },
    profilePic: '/api/assets/doc3.png',
    isActive: true
  },
  {
    name: 'Dr. Christopher Lee',
    email: 'christopher.lee@medbook.com',
    password: 'doctor123',
    role: 'doctor',
    specialization: 'Pediatricians',
    degree: 'MBBS',
    experience: 2,
    about: 'Dr. Lee specializes in pediatric care with a gentle approach to children\'s health.',
    consultationFee: 40,
    address: {
      line1: '47th Cross, Richmond',
      line2: 'Circle, Ring Road, London'
    },
    profilePic: '/api/assets/doc4.png',
    isActive: true
  },
  {
    name: 'Dr. Jennifer Garcia',
    email: 'jennifer.garcia@medbook.com',
    password: 'doctor123',
    role: 'doctor',
    specialization: 'Neurologist',
    degree: 'MBBS',
    experience: 4,
    about: 'Dr. Garcia is a specialist in neurological disorders and brain health.',
    consultationFee: 50,
    address: {
      line1: '57th Cross, Richmond',
      line2: 'Circle, Ring Road, London'
    },
    profilePic: '/api/assets/doc5.png',
    isActive: true
  },
  {
    name: 'Dr. Andrew Williams',
    email: 'andrew.williams@medbook.com',
    password: 'doctor123',
    role: 'doctor',
    specialization: 'Neurologist',
    degree: 'MBBS',
    experience: 4,
    about: 'Dr. Williams focuses on advanced neurological treatments and patient care.',
    consultationFee: 50,
    address: {
      line1: '57th Cross, Richmond',
      line2: 'Circle, Ring Road, London'
    },
    profilePic: '/api/assets/doc6.png',
    isActive: true
  },
  {
    name: 'Dr. Christopher Davis',
    email: 'christopher.davis@medbook.com',
    password: 'doctor123',
    role: 'doctor',
    specialization: 'General physician',
    degree: 'MBBS',
    experience: 4,
    about: 'Dr. Davis provides comprehensive primary care with a focus on preventive medicine.',
    consultationFee: 50,
    address: {
      line1: '17th Cross, Richmond',
      line2: 'Circle, Ring Road, London'
    },
    profilePic: '/api/assets/doc7.png',
    isActive: true
  },
  {
    name: 'Dr. Timothy White',
    email: 'timothy.white@medbook.com',
    password: 'doctor123',
    role: 'doctor',
    specialization: 'Gynecologist',
    degree: 'MBBS',
    experience: 3,
    about: 'Dr. White specializes in women\'s reproductive health and wellness.',
    consultationFee: 60,
    address: {
      line1: '27th Cross, Richmond',
      line2: 'Circle, Ring Road, London'
    },
    profilePic: '/api/assets/doc8.png',
    isActive: true
  },
  {
    name: 'Dr. Ava Mitchell',
    email: 'ava.mitchell@medbook.com',
    password: 'doctor123',
    role: 'doctor',
    specialization: 'Dermatologist',
    degree: 'MBBS',
    experience: 1,
    about: 'Dr. Mitchell is passionate about skin health and cosmetic dermatology.',
    consultationFee: 30,
    address: {
      line1: '37th Cross, Richmond',
      line2: 'Circle, Ring Road, London'
    },
    profilePic: '/api/assets/doc9.png',
    isActive: true
  },
  {
    name: 'Dr. Jeffrey King',
    email: 'jeffrey.king@medbook.com',
    password: 'doctor123',
    role: 'doctor',
    specialization: 'Pediatricians',
    degree: 'MBBS',
    experience: 2,
    about: 'Dr. King provides compassionate care for children of all ages.',
    consultationFee: 40,
    address: {
      line1: '47th Cross, Richmond',
      line2: 'Circle, Ring Road, London'
    },
    profilePic: '/api/assets/doc10.png',
    isActive: true
  }
];

async function seedDoctors() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medbook');
    console.log('✅ Connected to MongoDB');

    // Clear existing doctors
    await User.deleteMany({ role: 'doctor' });
    console.log('🗑️  Cleared existing doctors');

    // Hash passwords and create doctors
    for (const doctorData of doctorsData) {
      const hashedPassword = await bcrypt.hash(doctorData.password, 12);
      const doctor = new User({
        ...doctorData,
        password: hashedPassword,
        emailVerified: true
      });
      await doctor.save();
      console.log(`✅ Created doctor: ${doctor.name}`);
    }

    console.log(`🎉 Successfully seeded ${doctorsData.length} doctors!`);
    
    // Create a test patient
    const testPatient = new User({
      name: 'Test Patient',
      email: 'patient@test.com',
      password: await bcrypt.hash('password123', 12),
      role: 'patient',
      emailVerified: true
    });
    
    const existingPatient = await User.findOne({ email: 'patient@test.com' });
    if (!existingPatient) {
      await testPatient.save();
      console.log('✅ Created test patient: patient@test.com / password123');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding doctors:', error);
    process.exit(1);
  }
}

seedDoctors();
