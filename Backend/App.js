import express from 'express'
import 'dotenv/config'
import useRoute from './Routes/User.routes.js'
import router from './Routes/User.routes.js'

const app = express()
app.use(express.json());


app.use(express.urlencoded({ extended: true }));

app.get('/', (req,res)=>{
    res.send('App listening!!!')
})

app.use('/', router)


export {app}