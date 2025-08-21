import express from 'express';
import cors from 'cors';
import userRoutes from './Routes/users.route.js';
import gigRoutes from './Routes/gigs.route.js';
import authRoutes from './Routes/auth.route.js';
import chatRoutes from './Routes/chat.routes.js'


const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Socket.io backend running")
})

app.use('/api/auth', authRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat',chatRoutes);



export {app}