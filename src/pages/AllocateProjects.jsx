import React, { useState } from "react";
import { Typography, Breadcrumbs, Box, CircularProgress, Tooltip, IconButton } from "@mui/material";
import DataGridTemplate from "../components/datagrids/DataGridProjectAllocation"
import SearchIcon from '@mui/icons-material/Search';
import BreadCrumb from "../components/BreadCrumb"


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

  // const columns = [
  //   { field: 'id', headerName: 'ID', flex: 1.5 },
  //   { field: 'empName', headerName: 'Emp Name', flex: 2 },
  //   { field: 'projectName', headerName: 'Project Name', flex: 2 },
  //   { field: 'month', headerName: 'Month', flex: 2 },
  //   { field: 'year', headerName: 'Year', flex: 2 },
  //   { field: 'allocation', headerName: 'Allocation', flex: 2 },
  //   { field: 'action', headerName: 'Action', flex: 2 },
  // ];

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'empName', headerName: 'Emp Name', width: 120 },
    { field: 'ipam', headerName: 'IPAM(OPEX)', width: 120 },
    { field: 'coal', headerName: 'COAL(OPEX)', width: 120 },
    { field: 'bam', headerName: 'BAM(OPEX)', width: 120 },
    { field: 'mjpay', headerName: 'MJPAY(OPEX)', width: 120 },
    { field: 'mats', headerName: 'MATS(CAPEX)', width: 120 },
    { field: 'common', headerName: 'COMMON', width: 120 },
    { field: 'total', headerName: 'TOTAL', width: 120 },
    { field: 'year', headerName: 'Year', width: 120 },
    { field: 'allocation', headerName: 'Allocation', width: 120},
    { field: 'action', headerName: 'Action', width: 120 },
  ];

  const [projects, setProjects] = useState([
    { id: 1, empName: "ABC", ipam: "Project Alpha", coal: "30%", bam: "10%", mjpay: "January",mats: "January", common:"10%", total:"100%", year: "2024", allocation: "20%", action: "" },
    { id: 1, empName: "ABC", ipam: "Project Alpha", coal: "30%", bam: "10%", mjpay: "January",mats: "January", common:"10%", total:"100%", year: "2024", allocation: "20%", action: "" },
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

      <BreadCrumb text1={"Projects"} text2={"Allocation"}/>

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

      {/* Project List Section */}
      <div className="p-2 w-[90%] mx-auto mt-4 text-sm">

        <div className="border border-gray-300 p-2 bg-white shadow-md rounded-lg">
          <Typography variant="h6" className="text-center text-white font-medium bg-dark-purple">
            Members List
          </Typography>
          <div className="overflow-x-auto mt-1">
            <DataGridTemplate columns={columns} rows={projects} />
          </div>
        </div>
      </div>
    </div>
  );

};

export default AllocateProjects;
