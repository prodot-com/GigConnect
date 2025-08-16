
import connect_db from "./src/db/Index.js";
import express from 'express'
import { app } from "./App.js";

connect_db()
.then(()=>{
    app.listen(process.env.PORT || 9000, ()=>{
        console.log(`App listening at port ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log('Connection failed', err)
})

