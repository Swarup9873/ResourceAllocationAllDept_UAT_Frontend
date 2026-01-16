import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dialog, Typography, Tooltip, Popover, IconButton, Button, Box } from "@mui/material";
import DataGridCreateProject from "../components/datagrids/DataGridCreateProject";
import CreateProjectModal from "../components/Modals/CreateProjectModal";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import EditProjectModal from "../components/Modals/EditProjectModal";

const base_URL = import.meta.env.VITE_BASE_URL;

const CreateProject = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const empCode = localStorage.getItem('ECN');
  const Token = localStorage.getItem('authToken');

  console.log({Token});
  

  // Function to handle Edit and Delete actions
  const handleOpen = (event, row, type) => {
    setSelectedRow(row);

    if (type === "edit") {
      setIsEditModalOpen(true); // Open Edit Modal
    } else if (type === "delete") {
      setAnchorEl(event.currentTarget); // Open Delete Popover
    }
  };

  const handleClose = () => {
    setAnchorEl(null); // Close Delete Popover
    setIsEditModalOpen(false); // Close Edit Modal
    setSelectedRow(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedRow) return;


    try {
      setLoading(true);
      const response = await axios.delete(`${base_URL}/api/ProjectMaster/Delete`, {
         data: {
          id: selectedRow.id,
          deletedBy: empCode.toString()
        },
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        toast.success("Project deleted successfully");
        setRefresh(prev => !prev);

      } else {
        toast.error("Couldn't delete project");
      }
    } 
    catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Error deleting project");
    } 
    finally {
      setLoading(false);
      handleClose();
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "ProjectCategoryName", headerName: "Project Category", width: 170 },
    { field: "ProjectName", headerName: "Project Name", width: 240 },
    {
      field: "isActive", headerName: "Status", width: 140,
      renderCell: (params) => {
        const val = params.value === true ? 'Active' : "Inactive";
        return <span>{val}</span>;
      }
    },
    {
      field: "ProjectStartDate",
      headerName: "Start Date",
      width: 140,
      renderCell: (params) => {
        const date = params.value
          ? new Date(params.value).toLocaleDateString("en-CA") // "YYYY-MM-DD" format
          : "";
        return <span>{date}</span>;
      }
    },
    {
      field: "ProjectEndDate",
      headerName: "End Date",
      width: 140,
      renderCell: (params) => {
        const date = params.value
  ? new Date(params.value).toLocaleDateString("en-CA") // "YYYY-MM-DD" format
  : "";
        return <span>{date}</span>;
      }
    },
    {
      field: "action",
      headerName: "Action",
      width: 105,
      disableColumnMenu: true,
      renderCell: (params) => (
        <>
          <IconButton onClick={(event) => handleOpen(event, params.row, "edit")} color="primary">
            <Tooltip title="Edit">
              <EditIcon />
            </Tooltip>
          </IconButton>
          <IconButton onClick={(event) => handleOpen(event, params.row, "delete")} color="error">
            <Tooltip title="Delete">
              <DeleteIcon />
            </Tooltip>
          </IconButton>
        </>
      ),
    },
  ];


  // Fetch data from API
  useEffect(() => {

    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${base_URL}/api/ProjectMaster/List`,
          { 
            headers: { 'Authorization': `Bearer ${Token}` } 
          }
        );
        const formattedData = response.data.data.map((project) => ({
          id: project.ID,
          ProjectCategoryName: project.ProjectCategoryName,
          ProjectName: project.ProjectName,
          isActive: project.IsActive,
          ProjectStartDate: project.ProjectStartDate,
          ProjectEndDate: project.ProjectEndDate,
        }));

        //console.log({ formattedData });

        setProjects(formattedData);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [refresh]);

  return (
    <>
      <div className="w-[90%] mx-auto mt-5 flex justify-end items-center">
        <Button
          variant="outlined"
          onClick={() => setIsCreateModalOpen(true)}
          className="ml-auto border-dark-purple text-dark-purple hover:bg-dark-purple hover:text-white font-sm px-3 py-1 rounded-md"
          sx={{
            borderColor: "#081A51", // Dark purple border
            color: "#081A51", // Dark purple text
            "&:hover": {
              backgroundColor: "#081A51", // Dark purple background on hover
              color: "white", // White text on hover
            },
          }}
        >
          + Create
        </Button>
      </div>

      {/* DataGrid Section */}
      <div className="p-2 border border-blue-500 rounded-lg w-[90%] mx-auto mt-4 text-sm overflow-hidden">
        <Typography variant="h6" className="text-white font-medium bg-dark-purple p-1">
          List of Projects
        </Typography>

        <div style={{ width: "100%", overflowX: "auto" }}>
          <DataGridCreateProject rows={projects} columns={columns} loading={loading} setLoading={setLoading} />
        </div>
      </div>

      {/* Modal for Creating Project */}
      <CreateProjectModal
        open={isCreateModalOpen} handleClose={() => setIsCreateModalOpen(false)}
        setIsModalOpen={setIsCreateModalOpen}
        projects={projects}
        setProjects={setProjects}
        setRefresh={setRefresh} />

      {/* Dialog for Editing Project */}
      <Dialog open={isEditModalOpen} onClose={handleClose}>
        <EditProjectModal
          selectedRow={selectedRow}
          setIsModalOpen={setIsEditModalOpen}
          setRefresh={setRefresh}
          refresh={refresh}
        />
      </Dialog>

      {/* Popover for Deleting Project */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Box p={2}>
          <Typography variant="body2">Delete Project?</Typography>
          <Button size="small" onClick={handleConfirmDelete} color="error">
            Confirm
          </Button>
        </Box>
      </Popover>
    </>
  );
};

export default CreateProject;