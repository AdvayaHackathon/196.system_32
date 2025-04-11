const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(morgan('dev')); // Logging middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(bodyParser.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Data storage with Map for better performance
const users = new Map([
  ['doctor@test.com', {
    id: '1',
    firstName: 'Dr. John',
    lastName: 'Smith',
    email: 'doctor@test.com',
    password: 'doctor123',
    role: 'Doctor',
    specialization: 'General Medicine',
    licenseNumber: 'MED123456'
  }],
  ['patient@test.com', {
    id: '2',
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'patient@test.com',
    password: 'patient123',
    role: 'Patient'
  }]
]);

const appointments = new Map([
  ['1', {
    id: '1',
    patientId: '1',
    doctorId: '1',
    patientName: 'Jane Doe',
    doctorName: 'Dr. John Smith',
    date: '2024-04-01',
    time: '10:00 AM',
    type: 'Follow-up',
    status: 'Scheduled',
    notes: 'Regular checkup'
  }],
  ['2', {
    id: '2',
    patientId: '2',
    doctorId: '1',
    patientName: 'Bob Smith',
    doctorName: 'Dr. John Smith',
    date: '2024-03-25',
    time: '2:30 PM',
    type: 'Regular Checkup',
    status: 'Scheduled',
    notes: 'Blood sugar monitoring'
  }]
]);

const patients = new Map([
  ['1', {
    id: '1',
    name: 'Jane Doe',
    age: 32,
    gender: 'Female',
    condition: 'Hypertension',
    email: 'patient@test.com',
    phone: '555-0123',
    lastVisit: '2024-03-15',
    nextAppointment: '2024-04-01',
    notes: []
  }],
  ['2', {
    id: '2',
    name: 'Bob Smith',
    age: 45,
    gender: 'Male',
    condition: 'Diabetes Type 2',
    email: 'bob@test.com',
    phone: '555-0124',
    lastVisit: '2024-03-18',
    nextAppointment: '2024-03-25',
    notes: []
  }]
]);

const prescriptions = new Map();
const medicalRecords = new Map();

// JWT Secret (should be in environment variables in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Input validation middleware
const validateUserInput = (req, res, next) => {
  const { firstName, lastName, email, password, role, specialization, licenseNumber } = req.body;
  
  if (!firstName || !lastName || !email || !password || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  if (role === 'Doctor' && (!specialization || !licenseNumber)) {
    return res.status(400).json({ error: 'Doctors require specialization and license number' });
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  // Password validation
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long' });
  }
  
  next();
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token is required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Role-based access control middleware
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memoryUsage: process.memoryUsage(),
    databaseStats: {
      users: users.size,
      appointments: appointments.size,
      patients: patients.size,
      prescriptions: prescriptions.size,
      medicalRecords: medicalRecords.size
    }
  });
});

// Authentication routes
app.post('/api/auth/register', validateUserInput, async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, specialization, licenseNumber } = req.body;

    // Check if user already exists
    if (users.has(email)) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const userId = uuidv4();
    const newUser = {
      id: userId,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      specialization,
      licenseNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active'
    };

    users.set(email, newUser);

    // Generate JWT token
    const token = jwt.sign(
      { id: userId, email, role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: userId,
        firstName,
        lastName,
        email,
        role,
        specialization
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // For test users, compare plain text passwords
    const isValidPassword = user.password === password;

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        specialization: user.specialization
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Protected routes
app.get('/api/stats', authenticateToken, (req, res) => {
  // Basic stats accessible to all logged-in users
  const baseStats = {
    totalAppointments: appointments.size, // Might need filtering later
  };

  // Role-specific stats
  let roleSpecificStats = {};
  if (['Doctor', 'Admin'].includes(req.user.role)) {
    roleSpecificStats = {
      totalPatients: patients.size,
      totalPrescriptions: prescriptions.size,
      totalMedicalRecords: medicalRecords.size,
      recentActivity: Array.from(appointments.values())
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5),
      upcomingAppointments: Array.from(appointments.values())
        .filter(a => new Date(a.date) > new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5)
    };
  } else { // Patient stats
    roleSpecificStats = {
       myUpcomingAppointments: Array.from(appointments.values())
        .filter(a => a.patientId === req.user.id && new Date(a.date) > new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5),
       myRecentPrescriptions: Array.from(prescriptions.values())
        .filter(p => p.patientId === req.user.id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3)
    };
  }

  res.json({ ...baseStats, ...roleSpecificStats });
});

// Appointments routes
app.get('/api/appointments', authenticateToken, (req, res) => {
  let userAppointments = [];
  if (['Doctor', 'Admin'].includes(req.user.role)) {
    // Doctors/Admins see all appointments (or could be filtered by doctorId)
     userAppointments = Array.from(appointments.values())
        .filter(a => a.doctorId === req.user.id); // Show only doctor's appointments
    // Or show all: userAppointments = Array.from(appointments.values());
  } else {
    // Patients see only their appointments
    userAppointments = Array.from(appointments.values())
      .filter(a => a.patientId === req.user.id);
  }
  res.json(userAppointments.sort((a, b) => new Date(a.date) - new Date(b.date)));
});

app.post('/api/appointments', authenticateToken, (req, res) => {
  // Assuming doctors create appointments for patients
  // Or patients request appointments (would need different logic)
  if (!['Doctor', 'Admin'].includes(req.user.role)) {
       return res.status(403).json({ error: 'Only doctors or admins can create appointments directly.' });
  }

  const appointmentId = uuidv4();
  const newAppointment = {
    id: appointmentId,
    ...req.body, // Expects patientId, doctorId, date, time, reason
    status: 'scheduled',
    createdBy: req.user.id, // Track who created it
    createdAt: new Date(),
    updatedAt: new Date()
  };
  appointments.set(appointmentId, newAppointment);
  res.status(201).json(newAppointment);
});

// Patients routes - Stays Doctor/Admin only for listing/creation
app.get('/api/patients', authenticateToken, checkRole(['Doctor', 'Admin']), (req, res) => {
  res.json(Array.from(patients.values()));
});

app.post('/api/patients', authenticateToken, checkRole(['Doctor', 'Admin']), (req, res) => {
  const patientId = uuidv4();
  const newPatient = {
    id: patientId,
    ...req.body,
    status: 'active',
    createdBy: req.user.id,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  // Potential: Check if patient user already exists in users map?
  patients.set(patientId, newPatient);
  res.status(201).json(newPatient);
});

// Medical Records routes - Stays Doctor/Admin only for listing/creation
app.get('/api/medical-records/:patientId', authenticateToken, checkRole(['Doctor', 'Admin']), (req, res) => {
  // Doctors can see records for any patient they look up
  const patientRecords = Array.from(medicalRecords.values())
    .filter(r => r.patientId === req.params.patientId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by newest first
  res.json(patientRecords);
});

app.post('/api/medical-records', authenticateToken, checkRole(['Doctor']), (req, res) => {
  const recordId = uuidv4();
  const newRecord = {
    id: recordId,
    ...req.body, // Expects patientId, diagnosis, notes, etc.
    doctorId: req.user.id,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  medicalRecords.set(recordId, newRecord);
  res.status(201).json(newRecord);
});

// Prescriptions routes
app.get('/api/prescriptions', authenticateToken, (req, res) => {
   let userPrescriptions = [];
  if (['Doctor', 'Admin'].includes(req.user.role)) {
    // Doctors/Admins see prescriptions they created
     userPrescriptions = Array.from(prescriptions.values())
        .filter(p => p.doctorId === req.user.id);
    // Or show all: userPrescriptions = Array.from(prescriptions.values());
  } else {
    // Patients see only their prescriptions
    userPrescriptions = Array.from(prescriptions.values())
      .filter(p => p.patientId === req.user.id);
  }
  res.json(userPrescriptions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

app.post('/api/prescriptions', authenticateToken, checkRole(['Doctor']), (req, res) => {
  const prescriptionId = uuidv4();
  const newPrescription = {
    id: prescriptionId,
    ...req.body, // Expects patientId, medication, dosage, instructions, etc.
    doctorId: req.user.id,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  prescriptions.set(prescriptionId, newPrescription);
  res.status(201).json(newPrescription);
});

// Maybe add an endpoint for patients to view their own profile?
app.get('/api/users/me', authenticateToken, (req, res) => {
  const user = users.get(req.user.email);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  // Return non-sensitive user info
  res.json({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    specialization: user.specialization, // Only relevant for doctors
    createdAt: user.createdAt
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 