import React from 'react'
import Home from './Components/Home/Home'
import { BrowserRouter, Routes, Route , Link} from 'react-router-dom'
import ClientDashboard from './Components/Dashboard/ClientDashboard'
import FreeDashboard from './Components/Dashboard/FreeDashboard'

const App = () => {
  return (
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/client' element={<ClientDashboard/>} />
          <Route path='/freelancer' element={<FreeDashboard/>} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
