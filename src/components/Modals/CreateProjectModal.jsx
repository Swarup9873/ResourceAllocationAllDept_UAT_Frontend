import React, { useState } from 'react'
import { CircularProgress } from '@mui/material';



function CreateProjectModal({ setIsModalOpen, projects, setProjects }) {

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

    const handleSubmit = (e) => {
        e.preventDefault();

        setLoading(true);

        const newProject = {
            id: projects.length + 1,
            category: formData.category,
            name: formData.projectName,
            startDate: formData.startDate,
            endDate: formData.endDate,
        };

        setProjects([...projects, newProject]);
        setFormData({ category: "", projectName: "", startDate: "", endDate: "" });

        setTimeout(() => {
            setLoading(false)
            setIsModalOpen(false);
        }, 3000)
    };
    return (
        <div>
            {/* CircularProgress overlay when loading */}
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <CircularProgress color="primary" />
                </div>
            )}

            <div 
                className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center p-6"
                onClick={() => setIsModalOpen(false)}
            >
                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <h2 className="text-lg font-medium text-gray-700 mb-4">Create New Project</h2>
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div>
                            <label className="block text-gray-700 text-sm font-sm">Project Category*</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 p-2 text-sm rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            >
                                <option value="">-- Select Category --</option>
                                <option value="Opex">Opex</option>
                                <option value="Capex">Capex</option>
                            </select>

                        </div>


                        <div>
                            <label className="block text-gray-700 text-sm font-sm">Project Name*</label>
                            <input
                                type="text"
                                name="projectName"
                                placeholder="Enter project name"
                                value={formData.projectName}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 p-2 text-sm rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-sm">Project Amount*</label>
                            <input
                                type="text"
                                name="projectAmount"
                                placeholder="Approx project amount"
                                value={formData.projectAmount}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 p-2 text-sm rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            />
                        </div>

                        <div className="w-full text-sm flex justify-between ">
                            <div>
                                <label className="block text-gray-700 text-sm font-sm">Start Date*</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 p-2 text-sm rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                />
                            </div>


                            <div>
                                <label className="block text-gray-700 text-sm font-sm">End Date*</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 p-2 text-sm rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                />
                            </div>
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
        </div>
    )
}

export default CreateProjectModal