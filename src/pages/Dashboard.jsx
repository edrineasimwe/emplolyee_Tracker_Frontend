import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Dashboard() {
  const [totalEmployees, setTotalEmployees] = useState(0)
  const [pendingLeaves, setPendingLeaves] = useState(0)
  const [leaveTypes, setLeaveTypes] = useState(0)
  const [leaveTypeList, setLeaveTypeList] = useState([])
  const [employeeList, setEmployeeList] = useState([]) // store employee list for dropdown

  const [showEmployeeForm, setShowEmployeeForm] = useState(false)
  const [showLeaveForm, setShowLeaveForm] = useState(false)

  const [employeeData, setEmployeeData] = useState({ name: '', email: '', role: '' })
  const [leaveData, setLeaveData] = useState({ employeeId: '', leaveType: '', status: '', startDate: '', endDate: '' })

  // Fetch counts and lists for dashboard
  const fetchDashboardData = async () => {
    try {
      const [employeesRes, leavesRes, leaveTypesRes] = await Promise.all([
        axios.get('http://localhost:8080/api/employees'),
        axios.get('http://localhost:8080/api/leaves'),
        axios.get('http://localhost:8080/api/leave-types')
      ])

      // Counts
      setTotalEmployees(employeesRes.data.length)
      const pending = leavesRes.data.filter(
        (leave) => leave.status && leave.status.toLowerCase() === 'pending'
      ).length
      setPendingLeaves(pending)
      setLeaveTypes(leaveTypesRes.data.length)

      // Store lists
      setEmployeeList(employeesRes.data)
      setLeaveTypeList(leaveTypesRes.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Create new employee
  const handleCreateEmployee = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:8080/api/employees', employeeData)
      alert('Employee created successfully!')
      setShowEmployeeForm(false)
      setEmployeeData({ name: '', email: '', role: '' })
      fetchDashboardData()
    } catch (error) {
      console.error('Error creating employee:', error)
      alert('Failed to create employee.')
    }
  }

  // Create new leave
  const handleCreateLeave = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:8080/api/leaves', leaveData)
      alert('Leave created successfully!')
      setShowLeaveForm(false)
      setLeaveData({ employeeId: '', leaveType: '', status: '', startDate: '', endDate: '' })
      fetchDashboardData()
    } catch (error) {
      console.log(leaveData);
      console.error('Error creating leave:', error);
      alert('Failed to create leave.')
    }
  }

  return (
    <div className="p-4">
      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold">Total Employees</h3>
          <p className="text-3xl mt-4">{totalEmployees}</p>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold">Pending Leaves</h3>
          <p className="text-3xl mt-4">{pendingLeaves}</p>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold">Leave Types</h3>
          <p className="text-3xl mt-4">{leaveTypes}</p>
        </div>

        {/* Quick Actions */}
        <div className="card sm:col-span-3 mt-4">
          <h2 className="text-xl font-semibold mb-2">Quick Actions</h2>
          <div className="flex gap-3">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => setShowLeaveForm(true)}
            >
              Create Leave
            </button>
            <button
              className="px-4 py-2 bg-gray-200 rounded"
              onClick={() => setShowEmployeeForm(true)}
            >
              Create Employee
            </button>
          </div>
        </div>
      </div>

      {/* Employee Form Modal */}
      {showEmployeeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <form
            onSubmit={handleCreateEmployee}
            className="bg-white p-6 rounded-lg shadow-lg w-96"
          >
            <h3 className="text-lg font-semibold mb-4">Create Employee</h3>
            <input
              type="text"
              placeholder="Name"
              value={employeeData.name}
              onChange={(e) => setEmployeeData({ ...employeeData, name: e.target.value })}
              className="border p-2 w-full mb-3"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={employeeData.email}
              onChange={(e) => setEmployeeData({ ...employeeData, email: e.target.value })}
              className="border p-2 w-full mb-3"
              required
            />
            <select
              value={employeeData.role}
              onChange={(e) => setEmployeeData({ ...employeeData, role: e.target.value })}
              className="border p-2 w-full mb-3"
              required
            >
              <option value="" disabled>Choose role</option>
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowEmployeeForm(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Leave Form Modal */}
      {showLeaveForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <form
            onSubmit={handleCreateLeave}
            className="bg-white p-6 rounded-lg shadow-lg w-96"
          >
            <h3 className="text-lg font-semibold mb-4">Create Leave</h3>

            {/* Employee dropdown */}
            <select
              value={leaveData.employeeId}
              onChange={(e) => setLeaveData({ ...leaveData, employeeId: e.target.value })}
              className="border p-2 w-full mb-3"
              required
            >
              <option value="" disabled>Choose employee</option>
              {employeeList.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.email})
                </option>
              ))}
            </select>

            {/* Leave Type dropdown */}
            <select
              value={leaveData.leaveType}
              onChange={(e) => setLeaveData({ ...leaveData, leaveType: e.target.value })}
              className="border p-2 w-full mb-3"
              required
            >
              <option value="" disabled>Choose leave type</option>
              {leaveTypeList.map((type) => (
                <option key={type.id} value={type.name}>
                  {type.name}
                </option>
              ))}
            </select>

            {/* Leave Status dropdown */}
            <select
              value={leaveData.status}
              onChange={(e) => setLeaveData({ ...leaveData, status: e.target.value })}
              className="border p-2 w-full mb-3"
              required
            >
              <option value="" disabled>Choose status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowLeaveForm(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
