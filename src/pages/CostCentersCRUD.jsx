import { useState, useEffect } from "react";
import axios from "axios";
import { Dialog, Typography, Tooltip, IconButton, Button, Box, TextField } from "@mui/material";
import DataGridCostCentersList from "../components/datagrids/DataGridCostCentersList";
import CreateCCModal from "../components/Modals/CreateCCModal";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";
import EditCCModal from "../components/Modals/EditCCModal";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

const base_URL = import.meta.env.VITE_BASE_URL;

const CostCentersCRUD = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [costCenters, setCostCenters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [searchText, setSearchText] = useState("");

    const navigate = useNavigate();

    const empCode = localStorage.getItem('ECN');
    const Token = localStorage.getItem('authToken');


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
        if (Token) {
            const decoded = jwtDecode(Token);
            const isExpired = decoded.exp * 1000 < Date.now();
            if (isExpired) {
                toast.error("Session expired. Please login again.");
                localStorage.clear();
                navigate('/');
            }
        }

        if (!selectedRow) return;


        try {
            setLoading(true);
            const response = await axios.delete(`${base_URL}/api/ProjectMaster/Delete`, {
                id: selectedRow.id,
                deletedBy: empCode.toString(),
            },
                {
                    headers: {
                        'Authorization': `Bearer ${Token}`
                    }
                }
            );

            if (response.status === 200) {
                toast.success("Project deleted successfully");
                setRefresh((prev) => !prev); // Refresh the data
            }
            else {
                toast.error(response.returnMessage);
            }
        }
        catch (error) {
            console.error("Error deleting project:", error);
            toast.error("Error deleting project" + error.message);
        }
        finally {
            setLoading(false);
            handleClose();
        }
    };

    const columns = [
        { field: "id", headerName: "CC Code", width: 80, flex: 2 },
        { field: "DeptName", headerName: "Department Name", width: 240, flex: 3 },
        { field: "DepartmentType", headerName: "Type", width: 170, flex: 2 },
        {
            field: "isActive", headerName: "Status", width: 140,
            renderCell: (params) => {
                const val = params.value === true ? 'Active' : "Inactive";
                return <span>{val}</span>;
            }, flex: 1.5
        },
        {
      field: "action",
      headerName: "Action",
      width: 105,
      disableColumnMenu: true,
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton onClick={(event) => handleOpen(event, params.row, "edit")} color="primary">
            <Tooltip title="Edit">
              <EditIcon />
            </Tooltip>
          </IconButton>
          {/* <IconButton onClick={(event) => handleOpen(event, params.row, "delete")} color="error">
            <Tooltip title="Delete">
              <DeleteIcon />
            </Tooltip>
          </IconButton> */}
        </>
      ),
    },
    ];

    const filteredProjects = costCenters.filter((row) => {
        const search = searchText.toLowerCase();

        return (
            row.id?.toString().toLowerCase().includes(search) ||
            row.DeptName?.toLowerCase().includes(search) ||
            row.DepartmentType?.toLowerCase().includes(search)
        );
    });

    useEffect(() => {
        if (Token) {
            const decoded = jwtDecode(Token);
            const isExpired = decoded.exp * 1000 < Date.now();
            if (isExpired) {
                toast.error("Session expired. Please login again.");
                localStorage.clear();
                navigate('/');
            }
        }

        const fetchCostCenters = async () => {
            try {
                const response = await axios.get(`${base_URL}/api/CCMaster/List/CC`,
                    {
                        headers: { 'Authorization': `Bearer ${Token}` }
                    }
                );
                const formattedData = response.data.data.map((cc) => ({
                    id: cc.CC_Code,
                    DeptName: cc.DeptName,
                    DepartmentType: cc.DepartmentType,
                    isActive: cc.IsActive
                }));

                setCostCenters(formattedData);
            }
            catch (error) {
                toast.error(error.message);
                console.error("Error fetching costCenters:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCostCenters();
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
                <div className="flex items-center justify-between bg-dark-purple p-2 rounded-t-lg">
                    <Typography variant="subtitle1" className="text-white font-medium">
                        All Cost Centers
                    </Typography>

                    <TextField
                        size="small"
                        placeholder="Search CC_Code / Name / Type"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        sx={{
                            backgroundColor: "white",
                            borderRadius: "6px",
                            minWidth: 220,
                            "& .MuiInputBase-input": {
                                fontSize: "0.75rem",
                                padding: "6px 8px",
                            },
                        }}
                    />
                </div>

                <div style={{ width: "100%", overflowX: "auto" }}>
                    <DataGridCostCentersList rows={filteredProjects} columns={columns} loading={loading} setLoading={setLoading} />
                </div>
            </div>

            {/* Modal for Creating CC */}
            <CreateCCModal
                open={isCreateModalOpen} handleClose={() => setIsCreateModalOpen(false)}               
                setRefresh={setRefresh} 
            />

            {/* Dialog for Editing CC */}
            <Dialog open={isEditModalOpen} onClose={handleClose}>
                <EditCCModal
                    selectedRow={selectedRow}
                    setIsModalOpen={setIsEditModalOpen}
                    setRefresh={setRefresh}
                />
            </Dialog>
        </>
    );
};

export default CostCentersCRUD;