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

  return (
    <div className='flex flex-col mt-28
            items-center h-screen space-y-5 text-center'>
      <h1 className='text-3xl font-bold pb-7 text-indigo-700'>{`Welcome Client ${clientDetails.name}`}</h1>
    </div>
  )
}

export default ClientDashboard
