import express from 'express'
import 'dotenv/config'
import authRoutes from './Routes/Auth.routes.js'
import profileRoutes from './Routes/Profile.routes.js'
import gigRoutes from './Routes/Gig.routes.js'

const app = express()
app.use(express.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use(express.urlencoded({ extended: true }));

app.get('/', (req,res)=>{
    res.send('App listening!!!')
})

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/gigs', gigRoutes);


export {app}