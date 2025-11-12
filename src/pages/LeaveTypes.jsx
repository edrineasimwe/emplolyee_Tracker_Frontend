import React, {useEffect, useState} from 'react'
import api from '../api/axiosConfig'

export default function LeaveTypes(){
  const [types, setTypes] = useState([])
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')

  useEffect(()=>{
    load()
  },[])

  function load(){
    api.get('/leave-types').then(res=>setTypes(res.data)).catch(console.error)
  }

  function handleCreate(e){
    e.preventDefault()
    api.post('/leave-types', { name, description: desc })
      .then(()=>{ setName(''); setDesc(''); load() })
      .catch(err=>alert('Error: '+(err.response?.data?.message||err.message)))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="card lg:col-span-2">
        <h1 className="text-2xl font-semibold mb-4">Leave Types</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead><tr className="text-left"><th className="px-4 py-2">ID</th><th className="px-4 py-2">Name</th><th className="px-4 py-2">Description</th></tr></thead>
            <tbody>
              {types.map(t=>(
                <tr key={t.id} className="border-t">
                  <td className="px-4 py-2">{t.id}</td>
                  <td className="px-4 py-2">{t.name}</td>
                  <td className="px-4 py-2">{t.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="card">
        <h2 className="text-lg font-semibold mb-3">Create Leave Type</h2>
        <form onSubmit={handleCreate} className="space-y-3">
          <div>
            <label className="block text-sm">Name</label>
            <input value={name} onChange={e=>setName(e.target.value)} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm">Description</label>
            <textarea value={desc} onChange={e=>setDesc(e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
        </form>
      </div>
    </div>
  )
}
