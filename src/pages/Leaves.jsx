import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Leave() {
  const [leaves, setLeaves] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [formData, setFormData] = useState({
    status: "Pending",
  });

  // Fetch all leaves
  const fetchLeaves = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/leaves");
      setLeaves(response.data);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Open edit modal and prefill status
  const handleEdit = (leave) => {
    setSelectedLeave(leave);
    setFormData({
      status: leave.status || leave.leaveStatus || "Pending",
    });
    setShowEditModal(true);
  };

  // Save edited status (PATCH)
  const handleSaveChanges = async () => {
    try {
      await axios.patch(
        `http://localhost:8080/api/leaves/${selectedLeave.id}/status`,
        null,
        { params: { status: formData.status } }
      );
      setShowEditModal(false);
      fetchLeaves(); // refresh table
      alert("Leave status updated successfully");
    } catch (error) {
      console.error("Error updating leave status:", error);
      alert("Failed to update status");
    }
  };

  // Delete leave entry
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this leave?")) return;

    try {
      await axios.delete(`http://localhost:8080/api/leaves/${id}`);
      fetchLeaves();
    } catch (error) {
      console.error("Error deleting leave:", error);
      alert("Failed to delete leave");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Leave Management</h2>

      {/* Leave Table */}
      <table className="min-w-full border border-gray-300 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Employee ID</th>
            <th className="border p-2">Leave Type</th>
            <th className="border p-2">Start Date</th>
            <th className="border p-2">End Date</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr key={leave.id}>
              <td className="border p-2">{leave.employeeId}</td>
              <td className="border p-2">{leave.leaveType}</td>
              <td className="border p-2">{leave.startDate}</td>
              <td className="border p-2">{leave.endDate}</td>
              <td className="border p-2">{leave.status}</td>

              <td className="border p-2 flex gap-2">
                <button
                  onClick={() => handleEdit(leave)}
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(leave.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Status Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 w-[400px] rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Edit Leave Status</h2>

            {/* Status Field */}
            <label className="block mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border p-2 w-full mb-3"
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="bg-gray-400 px-4 py-2 text-white rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveChanges}
                className="bg-green-600 px-4 py-2 text-white rounded"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
