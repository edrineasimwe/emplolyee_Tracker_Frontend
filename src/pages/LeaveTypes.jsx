import React, {useEffect, useState} from 'react'
import api from '../api/axiosConfig'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'

export default function LeaveTypes(){
  const [types, setTypes] = useState([])
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [editingTypeId, setEditingTypeId] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', description: '' })

  useEffect(()=>{
    load()
  },[])

  async function load(){
    try {
      const res = await api.get('/leave-types')
      setTypes(res.data)
    } catch (err) {
      console.error('Error loading leave types:', err)
    }
  }

  async function handleCreate(e){
    e.preventDefault()
    try {
      await api.post('/leave-types', { name, description: desc })
      setName('')
      setDesc('')
      await load()
    } catch (err) {
      alert('Error: '+(err.response?.data?.message||err.message))
    }
  }

  function handleEdit(type){
    setEditingTypeId(type.id)
    setEditForm({ name: type.name, description: type.description })
  }

  async function saveEdit(e){
    e.preventDefault()
    try {
      console.log('Saving leave type:', { id: editingTypeId, data: editForm })
      await api.patch(`/leave-types/${editingTypeId}`, editForm)
      alert('Leave type updated successfully!')
      setEditingTypeId(null)
      await load()
    } catch (err) {
      console.error('Save error:', err)
      console.error('Response status:', err.response?.status)
      console.error('Response data:', err.response?.data)
      alert('Error: '+(err.response?.data?.message || err.response?.statusText || err.message))
    }
  }

    async function handleDelete(id){
    if(window.confirm('Are you sure you want to delete this leave type?')){
      try {
        console.log('Deleting leave type:', id)
        await api.delete(`/leave-types/${id}`)
        alert('Leave type deleted successfully!')
        await load()
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
        <h1 className="text-2xl font-semibold mb-4">Leave Types</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead><tr className="text-left"><th className="px-4 py-2">ID</th><th className="px-4 py-2">Name</th><th className="px-4 py-2">Description</th><th className="px-4 py-2">Actions</th></tr></thead>
            <tbody>
              {types.map(t=>(
                <tr key={t.id} className="border-t">
                  <td className="px-4 py-2">{t.id}</td>
                  <td className="px-4 py-2">{t.name}</td>
                  <td className="px-4 py-2">{t.description}</td>
                  <td className="px-4 py-2 space-x-2 flex">
                    <button onClick={()=>handleEdit(t)} className="text-blue-600 hover:text-blue-800"><FiEdit2 size={18} /></button>
                    <button onClick={()=>handleDelete(t.id)} className="text-red-600 hover:text-red-800"><FiTrash2 size={18} /></button>
                  </td>
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
      {editingTypeId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <form onSubmit={saveEdit} className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Edit Leave Type</h3>
            <div>
              <label className="block text-sm mb-2">Name</label>
              <input type="text" className="w-full border rounded px-3 py-2 mb-3" value={editForm.name} onChange={e=>setEditForm({...editForm, name: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm mb-2">Description</label>
              <textarea className="w-full border rounded px-3 py-2 mb-3" value={editForm.description} onChange={e=>setEditForm({...editForm, description: e.target.value})} />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={()=>setEditingTypeId(null)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
