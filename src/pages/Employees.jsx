import React, {useEffect, useState} from 'react'
import api from '../api/axiosConfig'

export default function Employees(){
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    // api.get('http://localhost:8081/api/employees').then(res=>{
    //   setEmployees(res.data)
    // }).catch(err=>{
    //   console.error(err)
    // }).finally(()=>setLoading(false))
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const res = await api.get('/employees');
        setEmployees(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }}
    fetchEmployees();
  },[])

  console.log(employees);

  return (
    <div className="card">
      <h1 className="text-2xl font-semibold mb-4">Employees</h1>
      {loading ? <p>Loading…</p> : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead><tr className="text-left"><th className="px-4 py-2">ID</th><th className="px-4 py-2">Name</th><th className="px-4 py-2">Email</th><th className="px-4 py-2">Role</th></tr></thead>
            <tbody>
              {employees.map(emp=>(
                <tr key={emp.id} className="border-t">
                  <td className="px-4 py-2">{emp.id}</td>
                  <td className="px-4 py-2">{emp.name}</td>
                  <td className="px-4 py-2">{emp.email}</td>
                  <td className="px-4 py-2">{emp.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
