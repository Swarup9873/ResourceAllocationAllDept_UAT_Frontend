import React, { useState } from "react";
import { Typography, Breadcrumbs, Link } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import CreateProjectModal from "../components/Modals/CreateProjectModal";


const CreateProject = () => {

  
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const columns = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'category', headerName: 'Project Category', flex: 2 },
    { field: 'name', headerName: 'Project Name', flex: 2 },
    { field: 'startDate', headerName: 'Start Date', flex: 2 },
    { field: 'endDate', headerName: 'End Date', flex: 2 },
  ];
  
  const [projects, setProjects] = useState([
    { id: 1, category: "Opex", name: "Project Alpha", startDate: "2024-01-15", endDate: "2024-06-20" },
    { id: 2, category: "Capex", name: "Project Beta", startDate: "2024-02-01", endDate: "2024-07-10" },
    { id: 3, category: "Capex", name: "Project Gamma", startDate: "2024-03-05", endDate: "2024-08-15" },
    { id: 4, category: "Opex", name: "Project Delta", startDate: "2024-04-10", endDate: "2024-09-20" },
    { id: 5, category: "Capex", name: "Project Epsilon", startDate: "2024-05-01", endDate: "2024-10-25" },
    { id: 6, category: "Opex", name: "Project Zeta", startDate: "2024-06-15", endDate: "2024-12-10" },
    { id: 7, category: "Opex", name: "Project Zeta", startDate: "2024-06-15", endDate: "2024-12-10" },
    { id: 8, category: "Opex", name: "Project Zeta", startDate: "2024-06-15", endDate: "2024-12-10" },
    { id: 9, category: "Opex", name: "Project Zeta", startDate: "2024-06-15", endDate: "2024-12-10" },
  ]);


  const paginationModel = { page: 0, pageSize: 5 };


  return (
    <>
      {/* Header Section */}
      <div className="w-[90%] mx-auto mt-5">
        <Breadcrumbs aria-label="breadcrumb">
          <Typography color="inherit" href="/projects">
            Projects
          </Typography>
          <Typography color="textPrimary">Create Project</Typography>
        </Breadcrumbs>
      </div>

      <div className="w-[90%] mx-auto mt-5 flex justify-between items-center">
        <button
          onClick={() => setIsModalOpen(true)}
          className="ml-auto bg-dark-purple text-white px-4 py-2 rounded-lg shadow-md"
        >
          + Create
        </button>
      </div>

      <div className="p-2 border border-blue-500 rounded-lg w-[90%] mx-auto mt-4 text-sm overflow-hidden">

        <Typography variant="h6" className="text-center text-white font-medium bg-dark-purple">
          Project List
        </Typography>
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <DataGrid
            rows={projects}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            rowHeight={30}
            sx={{
              minWidth: 800,
              maxWidth: '100%', // Keeps it within the parent div
              border: 0,
              height: 'auto', // Adjust the height
              maxHeight: '280',
              width: '100%', // Make the grid take less width
              fontSize: '0.775rem', // Make text smaller
              '.MuiDataGrid-columnHeader': {
                fontSize: '0.775rem', // Make column header font smaller
              },
              '.MuiDataGrid-cell': {
                fontSize: '0.675rem', // Make cell text smaller
              },
              '& .MuiDataGrid-row:nth-of-type(even)': {
                backgroundColor: '#f7f7f7', // Light gray background for alternate rows
              },
              '& .MuiDataGrid-row:nth-of-type(odd)': {
                backgroundColor: '#ffffff', // White background for normal rows
              },
            }}
          />
        </div>
      </div>

      {/* Modal for Creating Project */}
      {isModalOpen && (<CreateProjectModal setIsModalOpen={setIsModalOpen} projects={projects} setProjects={setProjects} />)}

    </>
  );
};

export default CreateProject;
