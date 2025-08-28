import express from 'express';
import cors from 'cors';
import userRoutes from './Routes/users.route.js';
import gigRoutes from './Routes/gigs.route.js';
import authRoutes from './Routes/auth.route.js';
import messageRoutes from './Routes/message.route.js';
import paymentRoutes from './Routes/razorpay.route.js';

const app = express();


app.use(cors({
  origin: [
    "http://localhost:5173", 
    "https://gig-connect-eight.vercel.app",
    "https://gigconnect-sq1z.onrender.com/",
    "https://gig-connect-7jr8.vercel.app/"
  ],
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send("Socket.io backend running");
});

app.use('/api/auth', authRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/payments', paymentRoutes);

export { app };
