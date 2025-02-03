import React, { useState } from "react";
import axios from 'axios';
import { Typography } from "@mui/material";


const CreateProject = () => {

  const [formData, setFormData] = useState({
    category: "",
    projectName: "",
    startDate: "",
    endDate: "",
  });

  const projects = []; // Empty array initially

  const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;
  
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = projects.slice(indexOfFirstRow, indexOfLastRow);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <>
    <div className="w-[90%] mx-auto mt-5">
      <h1 className="text-lg font-semibold text-blue-700">Create Projects</h1>
    </div>
      <div className="p-3 border border-blue-500 rounded-lg w-[90%] mx-auto mt-5">
        {/* Form Section */}

        <form onSubmit={handleSubmit} className="border border-gray-300 p-4 bg-white shadow-md rounded-lg mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Project Category:</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 text-sm rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
              >
                <option value="">-- Select Category --</option>
                <option value="category2">Opex</option>
                <option value="category1">Capex</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Project Name:</label>
              <input
                type="text"
                name="projectName"
                placeholder="Enter project name"
                value={formData.projectName}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 text-sm rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Start Date:</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 text-sm rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">End Date:</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 text-sm rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="mt-6 text-right">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg shadow-md transition-all"
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      <div className="p-2 border border-blue-500 rounded-lg w-[90%] mx-auto mt-4 text-sm">
        {/* Project List Section */}
        {/* <div>
          <h2 className="font-medium text-sm">Projects List:</h2>
          <div className="overflow-x-auto mt-2">
            <table className="w-full border border-gray-300">
              <thead className="bg-gray-100 text-xs">
                <tr>
                  <th className="border border-gray-300 px-2 py-1 text-left">Id</th>
                  <th className="border border-gray-300 px-2 py-1 text-left">Project Category</th>
                  <th className="border border-gray-300 px-2 py-1 text-left">Project Name</th>
                  <th className="border border-gray-300 px-2 py-1 text-left">Start Date</th>
                  <th className="border border-gray-300 px-2 py-1 text-left">End Date</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center p-3 text-gray-500">
                      No data available
                    </td>
                  </tr>
                ) : (
                  projects.map((project, index) => (
                    <tr key={index}>
                      <td className="border px-2 py-1">{project.id}</td>
                      <td className="border px-2 py-1">{project.category}</td>
                      <td className="border px-2 py-1">{project.name}</td>
                      <td className="border px-2 py-1">{project.startDate}</td>
                      <td className="border px-2 py-1">{project.endDate}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div> */}

        
        <Typography variant="h6" className="text-center text-white font-medium bg-dark-purple">
          Project List
        </Typography>

        <div className="overflow-x-auto mt-2">
          <div className="max-h-[200px] overflow-y-auto">
            <table className="w-full border border-gray-300">
              <thead className="bg-gray-100 text-xs">
                <tr>
                  <th className="border border-gray-300 px-2 py-1 text-left">Id</th>
                  <th className="border border-gray-300 px-2 py-1 text-left">Project Category</th>
                  <th className="border border-gray-300 px-2 py-1 text-left">Project Name</th>
                  <th className="border border-gray-300 px-2 py-1 text-left">Start Date</th>
                  <th className="border border-gray-300 px-2 py-1 text-left">End Date</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {currentRows.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center p-3 text-gray-500">No data available</td>
                  </tr>
                ) : (
                  currentRows.map((project) => (
                    <tr key={project.id}>
                      <td className="border px-2 py-1">{project.id}</td>
                      <td className="border px-2 py-1">{project.category}</td>
                      <td className="border px-2 py-1">{project.name}</td>
                      <td className="border px-2 py-1">{project.startDate}</td>
                      <td className="border px-2 py-1">{project.endDate}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

          </div>
        </div>

        {projects.length > rowsPerPage && (
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-sm">Page {currentPage}</span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(projects.length / rowsPerPage)))}
              disabled={currentPage === Math.ceil(projects.length / rowsPerPage)}
              className="px-4 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CreateProject;
