import React, {useEffect, useState} from 'react'
import api from '../api/axiosConfig'

export default function Leaves(){
  const [leaves, setLeaves] = useState([])
  const [employees, setEmployees] = useState([])
  const [types, setTypes] = useState([])
  const [form, setForm] = useState({ employeeId: '', leaveTypeId: '', startDate: '', endDate: '' })

  useEffect(()=>{
    loadAll()
  },[])

  function loadAll(){
    api.get('/leaves').then(res=>setLeaves(res.data)).catch(console.error)
    api.get('/employees').then(res=>setEmployees(res.data)).catch(console.error)
    api.get('/leave-types').then(res=>setTypes(res.data)).catch(console.error)
  }

  function handleCreate(e){
    e.preventDefault()
    api.post('/leaves', form).then(()=>{ setForm({ employeeId:'', leaveTypeId:'', startDate:'', endDate:'' }); loadAll() })
      .catch(err=>alert('Error: '+(err.response?.data?.message||err.message)))
  }

  function updateStatus(id, status){
    api.patch(`/leaves/${id}/status?status=${status}`).then(()=>loadAll()).catch(err=>alert('Error: '+err.message))
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
    </div>
  )
}
