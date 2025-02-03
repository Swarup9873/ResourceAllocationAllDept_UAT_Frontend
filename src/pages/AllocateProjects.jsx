import React, { useState } from "react";
import { Typography, Breadcrumbs } from "@mui/material";

const AllocateProjects = () => {

  const [formData, setFormData] = useState({
    month: "",
    year: "",
  });

  const projects = []; // Empty array initially

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
        <Breadcrumbs aria-label="breadcrumb">
          <Typography color="inherit" href="/projects">
            Projects
          </Typography>
          <Typography color="textPrimary">Allocate Project</Typography>
        </Breadcrumbs>
      </div>
      {/* Form Section */}
      <div className="p-2 w-[90%] mx-auto mt-5">
        <form onSubmit={handleSubmit} className="border border-gray-300 p-4 bg-white shadow-md rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {/* Project Category */}
            <div>
              <label className="block text-gray-800 text-sm font-medium mb-1">Month*</label>
              <select
                name="month"
                value={formData.month}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 text-sm rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                required
              >
                <option value="">-- Select Month --</option>
              </select>
            </div>
  
            {/* Project Name */}
            <div>
              <label className="block text-gray-800 text-sm font-medium mb-1">Year*</label>
              <input
                type="text"
                name="Year"
                placeholder="Enter Year"
                value={formData.year}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 text-sm rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                required
              />
            </div>
  
            {/* Search Button as Icon */}
            <div className="flex justify-end sm:col-span-2">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-lg shadow-md transition-all"
            >
              Search
            </button>
            </div>
          </div>
        </form>
      </div>
  
      {/* Project List Section */}
      <div className="p-2 w-[90%] mx-auto mt-4 text-sm">
        <div className="border border-gray-300 p-4 bg-white shadow-md rounded-lg">
          <h2 className="font-medium text-gray-800 text-base">Members List</h2>
          <div className="overflow-x-auto mt-2">
            <table className="w-full border border-gray-300 text-sm">
              <thead className="bg-gray-100 text-gray-700 text-sm font-medium">
                <tr>
                  <th className="border border-gray-300 px-3 py-2 text-left">Id</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Emp Name</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Project Name</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Month</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Year</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Allocation</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm">
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-3 text-gray-500">No data available</td>
                  </tr>
                ) : (
                  projects.map((project, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border px-3 py-2">{project.id}</td>
                      <td className="border px-3 py-2">{project.category}</td>
                      <td className="border px-3 py-2">{project.name}</td>
                      <td className="border px-3 py-2">{project.startDate}</td>
                      <td className="border px-3 py-2">{project.endDate}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
  
};

export default AllocateProjects;
