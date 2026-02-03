import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Database Connection
import connectDB from './config/db';
connectDB();

// Routes
import { notFound, errorHandler } from './middleware/errorMiddleware';
import authRoutes from './routes/authRoutes';
import jobRoutes from './routes/jobRoutes';
import profileRoutes from './routes/profileRoutes';
import applicationRoutes from './routes/applicationRoutes';
import uploadRoutes from './routes/uploadRoutes';
import adminRoutes from './routes/adminRoutes';
import publicRoutes from './routes/publicRoutes';
import companyRoutes from './routes/companyRoutes';

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/companies', companyRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Job Portal API', env: process.env.NODE_ENV });
});

// Error Handling (Must be last)
app.use(notFound);
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
