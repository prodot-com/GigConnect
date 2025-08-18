import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ClientDashboard = () => {
    const navigate = useNavigate()
    const [clientDetails, setClientDetails] = useState({})

    useEffect(()=>{
        const clientDetails = JSON.parse(localStorage.getItem('userDetails'))
        const token = localStorage.getItem('token')
        // console.log(clientDetails, token)
        setClientDetails(clientDetails)


    },[navigate])

    const logout = ()=>{
      localStorage.clear('token', 'userDetails')
      navigate('/')
    }

  return (
    <div className='flex flex-col'>
      <div className="flex justify-between items-center px-6 py-4 shadow-md">
        <h2 className="text-3xl font-bold">GigConnect</h2>

        <div className="space-x-4">
            <button onClick={logout} className="px-4 py-2 cursor-pointer bg-indigo-700 text-white rounded-lg hover:bg-blue-600">
            Logout
            </button>
        </div>
        </div>
    <div className='flex flex-col mt-28
            items-center  space-y-5 text-center'>
      <h1 className='text-3xl font-bold pb-7 text-indigo-700'>{`Welcome Client ${clientDetails.name}`}</h1>
    </div>
    <div className='flex justify-center space-x-12 pt-15'>
      <div className="">
            <button onClick={()=>navigate('/my-gig')} className="px-4 py-2 cursor-pointer bg-indigo-700 text-white rounded-lg hover:bg-blue-600">
            My Gigs
            </button>
        </div>
      <div className="">
            <button onClick={()=>navigate('/create-gig')} className="px-4 py-2 cursor-pointer bg-indigo-700 text-white rounded-lg hover:bg-blue-600">
            Create Gig
            </button>
        </div>
    </div>
    </div>
  )
}

export default ClientDashboard
