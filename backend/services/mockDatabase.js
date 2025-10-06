// Mock database service for testing without MongoDB
class MockDatabase {
  constructor() {
    this.users = [];
    this.appointments = [];
    this.nextUserId = 1;
    this.nextAppointmentId = 1;
    this.initialized = false;
    console.log('MockDatabase instance created');
  }

  // User operations
  async createUser(userData) {
    const user = {
      _id: `user_${this.nextUserId++}`,
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.push(user);
    console.log('User created:', user);
    return user;
  }

  async findUser(query) {
    console.log('Mock database findUser called with query:', query);
    const user = this.users.find(user => {
      return Object.keys(query).every(key => user[key] === query[key]);
    });
    console.log('Mock database findUser result:', user);
    return user;
  }

  async findUsers(query = {}) {
    console.log('Mock database findUsers called with query:', query);
    console.log('Current users in database:', this.users);
    const result = this.users.filter(user => {
      return Object.keys(query).every(key => user[key] === query[key]);
    });
    console.log('Filtered result:', result);
    return result;
  }

  async updateUser(id, updateData) {
    const user = this.users.find(u => u._id === id);
    if (user) {
      Object.assign(user, updateData, { updatedAt: new Date() });
      return user;
    }
    return null;
  }

  // Appointment operations
  async createAppointment(appointmentData) {
    const appointment = {
      _id: `appointment_${this.nextAppointmentId++}`,
      status: 'scheduled',
      ...appointmentData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.appointments.push(appointment);
    return appointment;
  }

  async findAppointments(query) {
    return this.appointments.filter(appointment => {
      return Object.keys(query).every(key => {
        if (key === 'appointmentDate') {
          // Special handling for date comparison
          return new Date(appointment[key]).toDateString() === new Date(query[key]).toDateString();
        }
        return appointment[key] === query[key];
      });
    });
  }

  async findAppointmentById(id) {
    return this.appointments.find(appointment => appointment._id === id);
  }

  async updateAppointment(id, updateData) {
    const appointment = this.appointments.find(a => a._id === id);
    if (appointment) {
      Object.assign(appointment, updateData, { updatedAt: new Date() });
      return appointment;
    }
    return null;
  }

  // Initialize with some sample data
  initializeSampleData() {
    // Only initialize once
    if (this.initialized) {
      console.log('Mock database already initialized, skipping...');
      return;
    }
    
    console.log('Initializing sample data...');
    // Clear existing data
    this.users = [];
    this.appointments = [];
    this.nextUserId = 1;
    this.nextAppointmentId = 1;
    
    // Add sample doctors
    this.createUser({
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@example.com',
      password: 'password123', // Use plain text for mock
      role: 'doctor',
      specialization: 'Cardiologist',
      experience: 10,
      consultationFee: 150,
      isActive: true
    });

    this.createUser({
      name: 'Dr. Michael Chen',
      email: 'michael.chen@example.com',
      password: 'password123', // Use plain text for mock
      role: 'doctor',
      specialization: 'Dermatologist',
      experience: 8,
      consultationFee: 120,
      isActive: true
    });

    // Add sample patient
    this.createUser({
      name: 'John Patient',
      email: 'john.patient@example.com',
      password: 'password123', // Use plain text for mock
      role: 'patient',
      isActive: true
    });
    
    // Add admin user
    this.createUser({
      name: 'Admin User',
      email: 'medbook@gmail.com',
      password: 'medbook123', // Use plain text for mock
      role: 'admin',
      isActive: true
    });
    
    // Add sample appointments
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + 7);
    
    this.createAppointment({
      _id: 'appointment_1',
      patient: 'user_3',
      doctor: 'user_1',
      appointmentDate: futureDate,
      appointmentTime: '10:00',
      reason: 'Regular checkup',
      status: 'scheduled',
      payment: {
        amount: 150,
        status: 'pending'
      }
    });
    
    this.initialized = true;
    console.log('Sample data initialized. Users count:', this.users.length);
  }
  
  // Method to check if initialized
  isInitialized() {
    return this.initialized;
  }
}

// Export singleton instance
let mockDatabaseInstance;

// Check if we already have an instance in the global scope
if (global.mockDatabaseInstance) {
  mockDatabaseInstance = global.mockDatabaseInstance;
  console.log('Reusing existing MockDatabase instance');
} else {
  mockDatabaseInstance = new MockDatabase();
  global.mockDatabaseInstance = mockDatabaseInstance;
  console.log('Created new MockDatabase instance');
}

// Initialize sample data if not already initialized
if (!mockDatabaseInstance.isInitialized()) {
  mockDatabaseInstance.initializeSampleData();
}

console.log('MockDatabase instance exported');
module.exports = mockDatabaseInstance;