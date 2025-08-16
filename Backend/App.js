import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './Routes/users.js';
import gigRoutes from './Routes/gigs.js';
import authRoutes from './Routes/auth.js';


const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/users', userRoutes);


export {app}