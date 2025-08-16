import express from 'express';
import cors from 'cors';
import userRoutes from './Routes/users.route.js';
import gigRoutes from './Routes/gigs.route.js';
import authRoutes from './Routes/auth.route.js';


const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/users', userRoutes);


export {app}