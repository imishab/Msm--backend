const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const adminRoutes = require('./routes/adminRoutes');
const zoneRoutes = require('./routes/zoneRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();
const app = express();

// Middleware
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://192.168.1.5:3002',
    '192.168.1.5:3002'


];
const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
connectDB();

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/zone', zoneRoutes);
app.use('/api', userRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('\x1b[32m%s\x1b[0m', `Server running on http://localhost:${PORT}`);
});
