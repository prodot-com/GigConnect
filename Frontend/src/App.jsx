import React from 'react'
import Home from './Components/Home/Home'
import { BrowserRouter, Routes, Route , Link} from 'react-router-dom'
import ClientDashboard from './Components/Dashboard/ClientDashboard'
import FreeDashboard from './Components/Dashboard/FreeDashboard'
import CreateGig from './Components/CreateGig/CreateGig'
import MyGigs from './Components/MyGigs.jsx/MyGigs'

const App = () => {
  return (
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/client' element={<ClientDashboard/>} />
          <Route path='/freelancer' element={<FreeDashboard/>} />
          <Route path='/create-gig' element={<CreateGig/>} />
          <Route path='/my-gig' element={<MyGigs/>} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
