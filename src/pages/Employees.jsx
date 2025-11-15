import React, { useEffect, useState } from 'react'
import api from '../api/axiosConfig'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import axios from 'axios'
export default function Employees() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)

  const [editingEmpId, setEditingEmpId] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '' })

  // Load employees
  useEffect(() => {
    loadAll()
  }, [])

  async function loadAll() {
    try {
      setLoading(true)
      const res = await api.get('/employees')
      setEmployees(res.data)
    } catch (err) {
      console.error('Error loading employees:', err)
    } finally {
      setLoading(false)
    }
  }

  // Open modal for editing
  function handleEdit(emp) {
    setEditingEmpId(emp.id)
    setEditForm({
      name: emp.name,
      email: emp.email,
      role: emp.role
    })
  }

  // Save updated employee
  const saveEdit = async (e) => {
    e.preventDefault()

    try {
      await api.put(`/employees/${editingEmpId}`, editForm)
      alert('Employee updated successfully!')
      setEditingEmpId(null)   // close modal
      loadAll()               // refresh table
    } catch (err) {
      console.error('Save error:', err.response?.data)
      alert('Failed to update employee.')
    }
  }

  // Delete employee
  async function handleDelete(id) {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.delete(`/employees/${id}`)
        alert('Employee deleted!')
        loadAll()
      } catch (err) {
        console.error('Delete error:', err)
        alert('Failed to delete employee.')
      }
    }
  }

  return (
    <div className="card">
      <h1 className="text-2xl font-semibold mb-4">Employees</h1>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="text-left">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id} className="border-t">
                  <td className="px-4 py-2">{emp.id}</td>
                  <td className="px-4 py-2">{emp.name}</td>
                  <td className="px-4 py-2">{emp.email}</td>
                  <td className="px-4 py-2">{emp.role}</td>

                  <td className="px-4 py-2 flex space-x-2">
                    <button
                      onClick={() => handleEdit(emp)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FiEdit2 size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(emp.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}

      {/* Edit Employee Modal */}
      {editingEmpId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <form
            onSubmit={saveEdit}
            className="bg-white p-6 rounded-lg shadow-lg w-96"
          >
            <h3 className="text-lg font-semibold mb-4">Edit Employee</h3>

            <label className="block text-sm mb-1">Name</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 mb-3"
              value={editForm.name}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
              required
            />

            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2 mb-3"
              value={editForm.email}
              onChange={(e) =>
                setEditForm({ ...editForm, email: e.target.value })
              }
              required
            />

            <label className="block text-sm mb-1">Role</label>
            <select
              className="w-full border rounded px-3 py-2 mb-3"
              value={editForm.role}
              onChange={(e) =>
                setEditForm({ ...editForm, role: e.target.value })
              }
              required
            >
              <option value="">Select role</option>
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
            </select>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingEmpId(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  )
}
