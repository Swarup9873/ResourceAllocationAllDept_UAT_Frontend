import React, { useState } from "react";
import { Typography, Breadcrumbs, Box, CircularProgress, Tooltip, IconButton } from "@mui/material";
import DataGridTemplate from "../components/datagrids/DataGridProjectAllocation"
import SearchIcon from '@mui/icons-material/Search';

const AllocateProjects = () => {

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    month: "",
    year: "",
  });

  const months = [
    "January", "February", "March"
  ];

  const years = Array.from({ length: 2 }, (_, i) => 2024 + i); // Generates years from 2020 to 2030

  //const projects = []; // Empty array initially

  const columns = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'empName', headerName: 'Emp Name', flex: 2 },
    { field: 'projectName', headerName: 'Project Name', flex: 2 },
    { field: 'month', headerName: 'Month', flex: 2 },
    { field: 'year', headerName: 'Year', flex: 2 },
    { field: 'allocation', headerName: 'Allocation', flex: 2 },
    { field: 'action', headerName: 'Action', flex: 2 },
  ];

  const [projects, setProjects] = useState([
    { id: 1, empName: "ABC", projectName: "Project Alpha", month: "January", year: "2024", allocation: "20%", action: "" },
  ]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();

    setTimeout(() => {
      setLoading(false)
    }, 3000)
  };

  return (
    <div className="relative">
      {/* CircularProgress overlay when loading */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <CircularProgress color="primary" />
        </div>
      )}
      <div className="w-[90%] mx-auto mt-5">
        <Box className="bg-dark-purple text-white py-2 px-4 relative inline-block">
          <Breadcrumbs aria-label="breadcrumb" className="text-white" separator={<span className="text-white">›</span>}>
            <Typography className="text-white">
              Projects
            </Typography>
            <Typography className="text-white">Project Allocation</Typography>
          </Breadcrumbs>

          <Box
            component="span"
            className="absolute right-[-20px] top-0 bottom-0 w-5 bg-dark-purple clip-arrow"
          />
          <style>
            {`
              .clip-arrow {
                clip-path: polygon(100% 50%, 0 0, 0 100%);
              }
            `}
          </style>
        </Box>

      </div>

      <div className="p-2 w-[90%] flex justify-end mx-auto mt-5">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          {/* Month Dropdown */}
          <select
            name="month"
            value={formData.month}
            onChange={handleChange}
            className="border border-gray-300 p-2 text-sm rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
            required
          >
            <option value="">Select Month</option>
            {months.map((month, index) => (
              <option key={index} value={month}>
                {month}
              </option>
            ))}
          </select>

          {/* Year Dropdown */}
          <select
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
            className="border border-gray-300 p-2 text-sm rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
          >
            <option value="">Select Year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          {/* Search Button */}
          <IconButton type="submit">
            <Tooltip title="Search">
              <SearchIcon />
            </Tooltip>
          </IconButton>
        </form>
      </div>

      {/* Form Section */}
      {/* <div className="p-2 w-[90%] mx-auto mt-5">
        <form onSubmit={handleSubmit} className="border border-gray-300 p-4 bg-white shadow-md rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
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
                {months.map((month, index) => (
                  <option key={index} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-800 text-sm font-medium mb-1">Year*</label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-2 text-sm rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
              >
                <option value="">-- Select Year --</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>


            <div className="flex justify-end sm:col-span-2">
              <button
                type="submit"
                className="bg-dark-purple text-white text-sm font-medium px-5 py-2 rounded-lg shadow-md transition-all"
              >
                Search
              </button>
            </div>
          </div>
        </form>
      </div> */}


      {/* Project List Section */}
      <div className="p-2 w-[90%] mx-auto mt-4 text-sm">

        <div className="border border-gray-300 p-2 bg-white shadow-md rounded-lg">
          <Typography variant="h6" className="text-center text-white font-medium bg-dark-purple">
            Members List
          </Typography>
          <div className="overflow-x-auto mt-2">
            <DataGridTemplate columns={columns} rows={projects} />
          </div>
        </div>
      </div>
    </div>
  );

};

export default AllocateProjects;
