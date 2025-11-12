import React from 'react'

export default function Dashboard(){
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div className="card">
        <h3 className="text-lg font-semibold">Total Employees</h3>
        <p className="text-3xl mt-4">—</p>
      </div>
      <div className="card">
        <h3 className="text-lg font-semibold">Pending Leaves</h3>
        <p className="text-3xl mt-4">—</p>
      </div>
      <div className="card">
        <h3 className="text-lg font-semibold">Leave Types</h3>
        <p className="text-3xl mt-4">—</p>
      </div>
      <div className="card sm:col-span-3 mt-4">
        <h2 className="text-xl font-semibold mb-2">Quick Actions</h2>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded">Create Leave</button>
          <button className="px-4 py-2 bg-gray-200 rounded">Create Employee</button>
        </div>
      </div>
    </div>
  )
}
