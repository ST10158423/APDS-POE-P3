import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import fs from 'fs';
import https from 'https';
import helmet from 'helmet';
import csurf from 'csurf';
import cookieParser from 'cookie-parser';
import { connectToDatabase } from './db/conn.mjs';
import postRoutes from './routes/post.mjs';
import userRoutes from './routes/user.mjs';
import paymentRoutes from './routes/payment.mjs';
import employeeRoutes from './routes/employee.mjs'; // Import the employee routes

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware configuration
app.use(cors({ credentials: true, origin: 'https://localhost:3000' }));
app.use(express.json());
app.use(helmet());
app.use(helmet.frameguard({ action: 'deny' }));
app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.use(helmet.ieNoOpen());
app.use(cookieParser());

// CSRF protection using cookies
const csrfProtection = csurf({ cookie: true });
app.use(csrfProtection);

// CSRF token route to retrieve the CSRF token
app.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Use SSL certificates
const privateKey = fs.readFileSync('C:/Users/lab_services_student/Desktop/APDS-P2-master/BACKEND/keys/privatekey.pem', 'utf8');
const certificate = fs.readFileSync('C:/Users/lab_services_student/Desktop/APDS-P2-master/BACKEND/keys/certificate.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Register the routes
app.use('/posts', postRoutes);
app.use('/users', userRoutes);
app.use('/payments', paymentRoutes);
app.use('/employee', employeeRoutes); // Register the employee routes with the prefix '/employee'

// Connect to the database and start the HTTPS server
connectToDatabase().then(() => {
  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(PORT, '0.0.0.0', () => { // Bind to '0.0.0.0' to allow external access
    console.log(`HTTPS Server is running on https://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to connect to database:', err);
});
