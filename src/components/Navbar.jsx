import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaUserFriends, FaCalendarAlt, FaClipboardList } from 'react-icons/fa'

const NavLink = ({to, children}) => {
  const loc = useLocation()
  const active = loc.pathname === to
  return (
    <Link to={to} className={`px-3 py-2 rounded ${active ? 'bg-white text-blue-600 shadow' : 'text-white/90 hover:bg-white/10'}`}>
      {children}
    </Link>
  )
}

export default function Navbar(){
  return (
    <nav className="bg-blue-600 text-white">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold">LMS</div>
          <div className="hidden sm:flex gap-2">
            <NavLink to="/"><span className="font-medium">Dashboard</span></NavLink>
            <NavLink to="/employees"><FaUserFriends className="inline mr-1" />Employees</NavLink>
            <NavLink to="/leavetypes"><FaClipboardList className="inline mr-1" />Leave Types</NavLink>
            <NavLink to="/leaves"><FaCalendarAlt className="inline mr-1" />Leaves</NavLink>
          </div>
        </div>
        <div className="text-sm">Welcome — <strong>Admin</strong></div>
      </div>
    </nav>
  )
}
