import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Employees from './pages/Employees'
import LeaveTypes from './pages/LeaveTypes'
import Leaves from './pages/Leaves'

export default function App(){
  return (
    <div>
      <Navbar />
      <main className="container mt-6">
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/employees' element={<Employees />} />
          <Route path='/leavetypes' element={<LeaveTypes />} />
          <Route path='/leaves' element={<Leaves />} />
        </Routes>
      </main>
    </div>
  )
}
