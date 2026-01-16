import { useState } from "react";
import { toast } from "react-toastify";
import { Box, Typography, CircularProgress } from '@mui/material';
import axios from "axios";
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from "react-router-dom";


const base_URL = import.meta.env.VITE_BASE_URL;

const CreateProjectModal = ({ open, handleClose, setRefresh }) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        category: "",
        projectName: "",
        projectAmount: "",
        startDate: "",
        endDate: "",
    });

    const empCode = localStorage.getItem('ECN')
    const Token = localStorage.getItem('authToken')

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (Token) {
            const decoded = jwtDecode(Token);
            const isExpired = decoded.exp * 1000 < Date.now();
            if (isExpired) {
                toast.error("Session expired. Please login again.");
                localStorage.clear();
                navigate('/');
            }
        }
        
        setLoading(true);

        try {
            const response = await axios.post(`${base_URL}/api/ProjectMaster/Create`, {
                projectCategoryName: formData.category,
                projectName: formData.projectName,
                projectStartDate: formData.startDate,
                projectEndDate: formData.endDate,
                createdBy: empCode.toString()
            },
            {
              headers: {
                'Authorization': `Bearer ${Token}`
              }
            }
        );

            if (response.status === 201 || response.status === 200) {
                setRefresh(true);
                toast.success("Project created successfully!");

                setFormData({
                    category: "",
                    projectName: "",
                    projectAmount: "",
                    startDate: "",
                    endDate: "",
                })
                handleClose();
            }
            else {
                toast.error("Failed to create project");
            }
        }
        catch (err) {
            toast.error("Something went wrong!");
            console.error("Error creating project:", err);
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null; // Prevent rendering when modal is closed

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={handleClose}>
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <CircularProgress color="primary" />
                </div>
            )}
            <div className="bg-white  max-w-sm rounded-md shadow-lg p-6 font-[Inter,sans-serif]" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-center text-lg font-semibold text-dark-purple">Create New Project</h2>
                <form onSubmit={handleSubmit} className=" text-xs font-xs space-y-4 mt-4">
                    {/* Project Category */}
                    <div>
                        <label className="block text-gray-700">Project Category*</label>
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
                        <label className="block text-gray-700">Project Name*</label>
                        <input
                            type="text"
                            name="projectName"
                            value={formData.projectName}
                            onChange={handleChange}
                            required
                            placeholder="Enter project name"
                            className=" w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                    </div>

                    {/* Estimated Amount (Only for Capex) */}
                    {/* {formData.category === "Capex" && (
                        <div>
                            <label className="block text-gray-700">Estimated Amount</label>
                            <input
                                type="text"
                                name="projectAmount"
                                value={formData.projectAmount}
                                onChange={handleChange}
                                placeholder="Approximate project amount"
                                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                            />
                        </div>
                    )} */}

                    {/* Start & End Dates */}
                    <div className="flex justify-between">
                        <div className="w-1/2 pr-2">
                            <label className="block text-gray-700">Start Date*</label>
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
                            <label className="block text-gray-700">End Date*</label>
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
                    <div className="flex justify-between mt-4 space-x-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-3 py-1 bg-gray-400 text-white rounded-sm hover:bg-gray-500 transition hover:scale-110"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-3 py-2 bg-dark-purple text-white rounded-sm transition hover:scale-110"
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
