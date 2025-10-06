const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const mockDatabase = require('../services/mockDatabase');

// Flag to check if MongoDB is available
let useMockDatabase = false;

// Check if MongoDB is available by trying to connect
try {
  // Check if MONGODB_URI is set
  if (!process.env.MONGODB_URI) {
    console.log('⚠️  MONGODB_URI not found in environment variables, using mock database');
    useMockDatabase = true;
  } else {
    // Check if we're actually connected to MongoDB
    if (mongoose.connection.readyState !== 1) {
      console.log('⚠️  Not connected to MongoDB, using mock database');
      useMockDatabase = true;
    }
  }
} catch (error) {
  console.log('⚠️  Error checking MongoDB connection, using mock database:', error.message);
  useMockDatabase = true;
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId; // Password required only if not Google user
    },
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: ['patient', 'doctor', 'admin'],
    default: 'patient'
  },
  googleId: {
    type: String,
    sparse: true
  },
  avatar: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  // Doctor specific fields
  specialization: {
    type: String,
    required: function() {
      return this.role === 'doctor';
    }
  },
  experience: {
    type: Number,
    default: 0
  },
  education: [{
    degree: String,
    institution: String,
    year: Number
  }],
  consultationFee: {
    type: Number,
    default: 0
  },
  availability: {
    monday: [{ start: String, end: String }],
    tuesday: [{ start: String, end: String }],
    wednesday: [{ start: String, end: String }],
    thursday: [{ start: String, end: String }],
    friday: [{ start: String, end: String }],
    saturday: [{ start: String, end: String }],
    sunday: [{ start: String, end: String }]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  emailVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get public profile
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.googleId;
  return userObject;
};

// Mock query builder to handle method chaining
class MockQuery {
  constructor(result, isFind = false) {
    this.result = result;
    this.isFind = isFind;
    // Don't initialize filteredResult here, we'll set it when the promise resolves
    this.filteredResult = null;
  }
  
  async select(fields) {
    // In a real implementation, this would filter fields
    // For mock, we'll just return the query object to allow chaining
    // If result is a promise, await it first
    if (this.result instanceof Promise && this.filteredResult === null) {
      this.filteredResult = await this.result;
    }
    return this;
  }
  
  async sort(sortObj) {
    // For mock database, we'll sort in the find method itself
    // If result is a promise, await it first
    if (this.result instanceof Promise && this.filteredResult === null) {
      this.filteredResult = await this.result;
    }
    return this;
  }
  
  async limit(limit) {
    // If result is a promise, await it first
    if (this.result instanceof Promise && this.filteredResult === null) {
      this.filteredResult = await this.result;
    }
    
    if (Array.isArray(this.filteredResult) && this.isFind) {
      this.filteredResult = this.filteredResult.slice(0, limit);
    }
    return this;
  }
  
  async skip(skip) {
    // If result is a promise, await it first
    if (this.result instanceof Promise && this.filteredResult === null) {
      this.filteredResult = await this.result;
    }
    
    if (Array.isArray(this.filteredResult) && this.isFind) {
      this.filteredResult = this.filteredResult.slice(skip);
    }
    return this;
  }
  
  then(onFulfilled, onRejected) {
    // If result is a promise, await it first
    if (this.result instanceof Promise) {
      return this.result.then(result => {
        this.filteredResult = result;
        return onFulfilled ? onFulfilled(result) : result;
      }, onRejected);
    } else {
      // If result is already resolved
      return Promise.resolve(this.filteredResult || this.result).then(onFulfilled, onRejected);
    }
  }
  
  catch(onRejected) {
    if (this.result instanceof Promise) {
      return this.result.catch(onRejected);
    } else {
      return Promise.resolve(this.filteredResult || this.result).catch(onRejected);
    }
  }
  
  // Make it iterable
  [Symbol.iterator]() {
    const result = this.filteredResult || this.result;
    if (Array.isArray(result)) {
      return result[Symbol.iterator]();
    }
    return [result][Symbol.iterator]();
  }
  
  // Add valueOf to handle direct access
  valueOf() {
    return this.filteredResult || this.result;
  }
  
  // Add toJSON to handle JSON serialization
  toJSON() {
    return this.filteredResult || this.result;
  }
}

// Mock database methods
userSchema.statics.mockFindOne = async function(query) {
  console.log('User.mockFindOne called with query:', query);
  const user = await mockDatabase.findUser(query);
  console.log('User.mockFindOne result:', user);
  return user;
};

userSchema.statics.mockFind = async function(query) {
  console.log('User.mockFind called with query:', query);
  const users = await mockDatabase.findUsers(query);
  console.log('User.mockFind result:', users);
  return users;
};

userSchema.statics.mockCreate = async function(userData) {
  console.log('User.mockCreate called with data:', userData);
  const user = await mockDatabase.createUser(userData);
  console.log('User.mockCreate result:', user);
  return user;
};

userSchema.statics.mockFindById = async function(id) {
  console.log('User.mockFindById called with id:', id);
  const user = await mockDatabase.findUser({ _id: id });
  console.log('User.mockFindById result:', user);
  return user;
};

userSchema.statics.mockCountDocuments = async function(query) {
  console.log('User.mockCountDocuments called with query:', query);
  const users = await mockDatabase.findUsers(query);
  const count = users.length;
  console.log('User.mockCountDocuments result:', count);
  return count;
};

// Update the mock User model to handle method chaining
let User;
if (useMockDatabase) {
  // Use mock database
  User = {
    findOne: function(query) {
      console.log('Mock User.findOne called with query:', query);
      return new MockQuery(userSchema.statics.mockFindOne(query));
    },
    find: function(query) {
      console.log('Mock User.find called with query:', query);
      return new MockQuery(userSchema.statics.mockFind(query), true);
    },
    create: userSchema.statics.mockCreate,
    findById: function(id) {
      return new MockQuery(userSchema.statics.mockFindById(id));
    },
    countDocuments: userSchema.statics.mockCountDocuments,
    schema: userSchema
  };
} else {
  try {
    User = mongoose.model('User', userSchema);
  } catch (error) {
    // If model already exists, use existing model
    User = mongoose.model('User');
  }
}

module.exports = User;