import React, {useEffect, useState} from 'react'
import api from '../api/axiosConfig'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'

export default function Leaves(){
  const [leaves, setLeaves] = useState([])
  const [employees, setEmployees] = useState([])
  const [types, setTypes] = useState([])
  const [form, setForm] = useState({ employeeId: '', leaveTypeId: '', startDate: '', endDate: '' })
  const [editingLeaveId, setEditingLeaveId] = useState(null)
  const [editForm, setEditForm] = useState({ employeeId: '', leaveTypeId: '', startDate: '', endDate: '' })

  useEffect(()=>{
    loadAll()
  },[])

  async function loadAll(){
    try {
      const [leavesRes, employeesRes, typesRes] = await Promise.all([
        api.get('/leaves'),
        api.get('/employees'),
        api.get('/leave-types')
      ])
      setLeaves(leavesRes.data)
      setEmployees(employeesRes.data)
      setTypes(typesRes.data)
    } catch (err) {
      console.error('Error loading data:', err)
    }
  }

  async function handleCreate(e){
    e.preventDefault()
    try {
      await api.post('/leaves', form)
      setForm({ employeeId:'', leaveTypeId:'', startDate:'', endDate:'' })
      await loadAll()
    } catch (err) {
      alert('Error: '+(err.response?.data?.message||err.message))
    }
  }

  async function updateStatus(id, status){
    try {
      await api.patch(`/leaves/${id}/status?status=${status}`)
      await loadAll()
    } catch (err) {
      alert('Error: '+err.message)
    }
  }

  function handleEdit(leave){
    setEditingLeaveId(leave.id)
    setEditForm({ employeeId: leave.employeeId, leaveTypeId: leave.leaveTypeId, startDate: leave.startDate, endDate: leave.endDate })
  }

  async function saveEdit(e){
    e.preventDefault()
    try {
      console.log('Saving leave:', { id: editingLeaveId, data: editForm })
      await api.patch(`/leaves/${editingLeaveId}`, editForm)
      alert('Leave updated successfully!')
      setEditingLeaveId(null)
      await loadAll()
    } catch (err) {
      console.error('Save error:', err)
      console.error('Response status:', err.response?.status)
      console.error('Response data:', err.response?.data)
      alert('Error: '+(err.response?.data?.message || err.response?.statusText || err.message))
    }
  }

  async function handleDelete(id){
    if(window.confirm('Are you sure you want to delete this leave?')){
      try {
        console.log('Deleting leave:', id)
        await api.delete(`/leaves/${id}`)
        alert('Leave deleted successfully!')
        await loadAll()
      } catch (err) {
        console.error('Delete error:', err)
        console.error('Response status:', err.response?.status)
        console.error('Response data:', err.response?.data)
        alert('Error: '+(err.response?.data?.message || err.response?.statusText || err.message))
      }
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="card lg:col-span-2">
        <h1 className="text-2xl font-semibold mb-4">Leaves</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead><tr className="text-left"><th className="px-4 py-2">ID</th><th className="px-4 py-2">Employee</th><th className="px-4 py-2">Type</th><th className="px-4 py-2">Start</th><th className="px-4 py-2">End</th><th className="px-4 py-2">Status</th><th className="px-4 py-2">Actions</th></tr></thead>
            <tbody>
              {leaves.map(l=>(
                <tr key={l.id} className="border-t">
                  <td className="px-4 py-2">{l.id}</td>
                  <td className="px-4 py-2">{l.employeeId}</td>
                  <td className="px-4 py-2">{l.leaveTypeId}</td>
                  <td className="px-4 py-2">{l.startDate}</td>
                  <td className="px-4 py-2">{l.endDate}</td>
                  <td className="px-4 py-2">{l.status}</td>
                  <td className="px-4 py-2 space-x-2">
                    {l.status==='PENDING' && <button onClick={()=>updateStatus(l.id,'APPROVED')} className="px-2 py-1 bg-green-600 text-white rounded">Approve</button>}
                    {l.status==='PENDING' && <button onClick={()=>updateStatus(l.id,'REJECTED')} className="px-2 py-1 bg-red-600 text-white rounded">Reject</button>}
                    <button onClick={()=>handleEdit(l)} className="text-blue-600 hover:text-blue-800"><FiEdit2 size={18} /></button>
                    <button onClick={()=>handleDelete(l.id)} className="text-red-600 hover:text-red-800"><FiTrash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="card">
        <h2 className="text-lg font-semibold mb-3">Request Leave</h2>
        <form onSubmit={handleCreate} className="space-y-3">
          <div>
            <label className="block text-sm">Employee</label>
            <select className="w-full border rounded px-3 py-2" value={form.employeeId} onChange={e=>setForm({...form, employeeId: e.target.value})} required>
              <option value="">Select</option>
              {employees.map(emp=> <option key={emp.id} value={emp.id}>{emp.name} ({emp.email})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm">Leave Type</label>
            <select className="w-full border rounded px-3 py-2" value={form.leaveTypeId} onChange={e=>setForm({...form, leaveTypeId: e.target.value})} required>
              <option value="">Select</option>
              {types.map(t=> <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm">Start Date</label>
            <input type="date" className="w-full border rounded px-3 py-2" value={form.startDate} onChange={e=>setForm({...form, startDate: e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm">End Date</label>
            <input type="date" className="w-full border rounded px-3 py-2" value={form.endDate} onChange={e=>setForm({...form, endDate: e.target.value})} required />
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Request</button>
        </form>
      </div>
      {editingLeaveId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <form onSubmit={saveEdit} className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Edit Leave</h3>
            <div>
              <label className="block text-sm">Employee</label>
              <select className="w-full border rounded px-3 py-2 mb-3" value={editForm.employeeId} onChange={e=>setEditForm({...editForm, employeeId: e.target.value})} required>
                <option value="">Select</option>
                {employees.map(emp=> <option key={emp.id} value={emp.id}>{emp.name} ({emp.email})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm">Leave Type</label>
              <select className="w-full border rounded px-3 py-2 mb-3" value={editForm.leaveTypeId} onChange={e=>setEditForm({...editForm, leaveTypeId: e.target.value})} required>
                <option value="">Select</option>
                {types.map(t=> <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm">Start Date</label>
              <input type="date" className="w-full border rounded px-3 py-2 mb-3" value={editForm.startDate} onChange={e=>setEditForm({...editForm, startDate: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm">End Date</label>
              <input type="date" className="w-full border rounded px-3 py-2 mb-3" value={editForm.endDate} onChange={e=>setEditForm({...editForm, endDate: e.target.value})} required />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={()=>setEditingLeaveId(null)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
