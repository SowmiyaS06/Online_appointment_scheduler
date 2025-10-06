require('dotenv').config();
const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/medbook';

async function seedAppointments() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get doctors and patients
    const doctors = await User.find({ role: 'doctor' }).limit(5);
    const patients = await User.find({ role: 'patient' }).limit(3);

    if (doctors.length === 0) {
      console.log('❌ No doctors found. Please run seedDoctors.js first.');
      return;
    }

    if (patients.length === 0) {
      console.log('❌ No patients found. Creating a test patient...');
      const testPatient = new User({
        name: 'Test Patient',
        email: 'patient@test.com',
        password: 'password123',
        role: 'patient',
        phone: '123-456-7890'
      });
      await testPatient.save();
      patients.push(testPatient);
    }

    // Clear existing appointments
    await Appointment.deleteMany({});
    console.log('🗑️  Cleared existing appointments');

    // Create sample appointments
    const appointments = [];
    const statuses = ['scheduled', 'confirmed', 'completed', 'cancelled'];
    const reasons = [
      'Regular checkup',
      'Follow-up appointment',
      'Consultation',
      'Emergency visit',
      'Routine examination'
    ];

    // Generate appointments for the last 30 days
    for (let i = 0; i < 50; i++) {
      const doctor = doctors[Math.floor(Math.random() * doctors.length)];
      const patient = patients[Math.floor(Math.random() * patients.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      // Random date in the last 30 days
      const appointmentDate = new Date();
      appointmentDate.setDate(appointmentDate.getDate() - Math.floor(Math.random() * 30));
      
      // Random time between 9 AM and 5 PM
      const hour = 9 + Math.floor(Math.random() * 8);
      const minute = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
      const appointmentTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

      const appointment = new Appointment({
        patient: patient._id,
        doctor: doctor._id,
        appointmentDate,
        appointmentTime,
        duration: 30,
        status,
        reason: reasons[Math.floor(Math.random() * reasons.length)],
        notes: `Appointment notes for ${patient.name}`,
        payment: {
          amount: 50 + Math.floor(Math.random() * 100), // $50-$150
          status: status === 'completed' ? 'paid' : 'pending',
          paymentMethod: 'online'
        },
        rating: status === 'completed' ? 4 + Math.random() : undefined
      });

      appointments.push(appointment);
    }

    // Save all appointments
    await Appointment.insertMany(appointments);
    console.log(`✅ Created ${appointments.length} appointments`);

    // Log some statistics
    const stats = await Appointment.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    console.log('\n📊 Appointment Statistics:');
    stats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count}`);
    });

    console.log('\n🎉 Successfully seeded appointments!');
  } catch (error) {
    console.error('❌ Error seeding appointments:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

seedAppointments();
