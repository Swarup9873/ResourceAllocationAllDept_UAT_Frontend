import React, { useState } from 'react'
import { CircularProgress } from '@mui/material';



function CreateProjectModal({setIsModalOpen, projects, setProjects}) {

    const [formData, setFormData] = useState({
        category: "",
        projectName: "",
        startDate: "",
        endDate: "",
    });
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.projectName || !formData.startDate || !formData.endDate || !formData.category) {
            alert("Please fill all fields");
            return;
        }

        const newProject = {
            id: projects.length + 1,
            category: formData.category,
            name: formData.projectName,
            startDate: formData.startDate,
            endDate: formData.endDate,
        };

        setProjects([...projects, newProject]);
        setFormData({ category: "", projectName: "", startDate: "", endDate: "" });
        setIsModalOpen(false);
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-medium text-gray-700 mb-4">Create New Project</h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="block text-gray-700 text-sm font-medium">Project Category:</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-2 text-sm rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        >
                            <option value="">-- Select Category --</option>
                            <option value="Opex">Opex</option>
                            <option value="Capex">Capex</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-medium">Project Name:</label>
                        <input
                            type="text"
                            name="projectName"
                            placeholder="Enter project name"
                            value={formData.projectName}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-2 text-sm rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-medium">Start Date:</label>
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-2 text-sm rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-medium">End Date:</label>
                        <input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-2 text-sm rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                    </div>

                    <div className="flex justify-between mt-4">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="bg-gray-400 hover:bg-gray-500 text-white font-medium px-4 py-2 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-dark-purple hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateProjectModal