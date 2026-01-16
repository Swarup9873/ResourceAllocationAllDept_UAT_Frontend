import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import ToggleSwitch from '../ToggleSwitch';
import { toast } from 'react-toastify';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from "react-router-dom";

const base_URL = import.meta.env.VITE_BASE_URL;

function EditProjectModal({ selectedRow, setIsModalOpen, setRefresh }) {

    const empCode = localStorage.getItem('ECN');
    const Token = localStorage.getItem('authToken');
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        id: selectedRow?.id,
        projectCategory: selectedRow?.ProjectCategoryName || '',
        projectName: selectedRow?.ProjectName || '',
        startDate: selectedRow?.ProjectStartDate ? new Date(selectedRow.ProjectStartDate).toLocaleDateString("en-CA")  : '',
        endDate: selectedRow?.ProjectEndDate ? new Date(selectedRow.ProjectEndDate).toLocaleDateString("en-CA")  : '',
        isActive: selectedRow?.isActive || false
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (e) => {

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
            const response = await axios.post(`${base_URL}/api/ProjectMaster/Update`,
                {
                    id: formData.id,
                    projectCategoryName: formData.projectCategory,
                    projectName: formData.projectName,
                    projectStartDate: formData.startDate,
                    projectEndDate: formData.endDate,
                    isActive: formData.isActive,
                    updatedBy: empCode.toString()
                },
                {
                  headers: {
                    'Authorization': `Bearer ${Token}`
                  }
                }
            );

            // If the request is successful, update the UI
            if (response.status === 201 || response.status === 200) {

                setRefresh(prev => !prev);
                toast.success("Project updated successfully!");
                setIsModalOpen(false);
            }
            else {
                toast.error("Failed to update project");
            }
        }
        catch (err) {
            toast.error("Something went wrong!");
            console.error("Error updating project:", err.message);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedRow) {
            setFormData({
                id: selectedRow.id,
                projectCategory: selectedRow.ProjectCategoryName || '',
                projectName: selectedRow.ProjectName || '',
                startDate: selectedRow.ProjectStartDate ? new Date(selectedRow.ProjectStartDate).toLocaleDateString("en-CA") : '',
                endDate: selectedRow.ProjectEndDate ? new Date(selectedRow.ProjectEndDate).toLocaleDateString("en-CA") : '',
                isActive: selectedRow.isActive || false
            });
        }
    }, [selectedRow]);

    return (
        <Box
            sx={{
                width: 300,
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                backgroundColor: 'white',
                borderRadius: 2,
                boxShadow: 3,
            }}
        >
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <CircularProgress color="primary" />
                </div>
            )}
            <Typography variant="subtitle1" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                Edit Project
            </Typography>

            <div>
                <label className="block text-gray-700 text-xs font-xs">Project Category*</label>
                <select
                    name="projectCategory"
                    value={formData.projectCategory}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 p-2 text-xs rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                >
                    <option value="">-- Select Category --</option>
                    <option value="Opex">Opex</option>
                    <option value="Capex">Capex</option>
                </select>
            </div>

            <div>
                <label className="block text-gray-700 text-xs font-xs">Project Name*</label>
                <input
                    type="text"
                    name="projectName"
                    placeholder="Enter project name"
                    value={formData.projectName}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 p-2 text-xs rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
            </div>


            <div>
                <label className="block text-gray-700 text-xs font-xs">Start Date*</label>
                <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 p-2 text-xs rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
            </div>

            <div>
                <label className="block text-gray-700 text-xs font-xs">End Date*</label>
                <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 p-2 text-xs rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
            </div>


            <ToggleSwitch
                statusName={"Project"}
                checked={formData.isActive}
                onChange={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
            />


            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0 }}>
                <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-400 hover:bg-gray-500 text-white text-xs font-xs px-3 py-2 rounded-sm"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    onClick={handleUpdate}
                    className="bg-dark-purple hover:bg-blue-700 text-white text-xs font-xs px-3 py-2 rounded-sm"
                >
                    Update
                </button>
            </Box>
        </Box>
    );
}

export default EditProjectModal;
