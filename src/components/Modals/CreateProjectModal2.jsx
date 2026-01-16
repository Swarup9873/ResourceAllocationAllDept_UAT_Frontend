import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const base_URL = import.meta.env.VITE_BASE_URL;

const CreateProjectModal = ({ open, handleClose, setRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    projectName: "",
    projectAmount: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${base_URL}/api/ProjectMaster/Create`, {
        projectCategoryName: formData.category,
        projectName: formData.projectName,
        projectStartDate: formData.startDate,
        projectEndDate: formData.endDate,
      });

      if (response.status === 201 || response.status === 200) {
        setRefresh(true);
        toast.success("Project created successfully!");
        handleClose();
      } else {
        toast.error("Failed to create project");
      }
    } catch (err) {
      toast.error("Something went wrong!");
      console.error("Error creating project:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null; // Prevent rendering when modal is closed

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-[80%] max-w-sm rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-800">Create New Project</h2>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Project Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Project Category*</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="">-- Select Category --</option>
              <option value="Opex">Opex</option>
              <option value="Capex">Capex</option>
            </select>
          </div>

          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Project Name*</label>
            <input
              type="text"
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              required
              placeholder="Enter project name"
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Estimated Amount (Only for Capex) */}
          {formData.category === "Capex" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Estimated Amount</label>
              <input
                type="text"
                name="projectAmount"
                value={formData.projectAmount}
                onChange={handleChange}
                placeholder="Approximate project amount"
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
          )}

          {/* Start & End Dates */}
          <div className="flex justify-between">
            <div className="w-1/2 pr-2">
              <label className="block text-sm font-medium text-gray-700">Start Date*</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            <div className="w-1/2 pl-2">
              <label className="block text-sm font-medium text-gray-700">End Date*</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end mt-4 space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-dark-purple text-white rounded-lg hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
