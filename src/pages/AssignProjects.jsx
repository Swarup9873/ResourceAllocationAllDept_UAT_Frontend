import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Typography,
  useMediaQuery,
  CircularProgress
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import SkeletonProjects from "../components/skeletonLoaders/skeletonUnAllocatedProjects";
import _ from "lodash"; // Import lodash for deep comparison
import { useNavigate } from "react-router-dom";
import {jwtDecode} from 'jwt-decode';


const base_URL = import.meta.env.VITE_BASE_URL;

const AssignProjects = () => {
  const [checked, setChecked] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingUnAllocated, setLoadingUnAllocated] = useState(false);
  const [loadingAllocated, setLoadingAllocated] = useState(false);
  const [projectsList, setProjectsList] = useState([]);
  const [allocatedList, setAllocatedList] = useState([]);
  const [initialAllocatedList, setInitialAllocatedList] = useState([]);
  const [movingDirection, setMovingDirection] = useState(null);
  const [selectedFrom, setSelectedFrom] = useState(null); // Tracks selection source
  const navigate = useNavigate();


  const empCode = localStorage.getItem("ECN");
  const Token = localStorage.getItem("authToken");

  const isMobile = useMediaQuery("(max-width: 640px)"); // Detect small screens

  const handleToggle = (value, listType) => {
    if (selectedFrom && selectedFrom !== listType) return; // Prevent selecting from the other list

    setSelectedFrom(listType); // Lock selection to one list

    const currentIndex = checked.findIndex((item) => item.id === value.id);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);


    if (newChecked.length === 0) {
      setSelectedFrom(null);
    } else {
      setSelectedFrom(listType); // Lock selection to the active list
    }
  };

  const fetchUnAllocatedProjects = async () => {

    if (Token) {
      const decoded = jwtDecode(Token);
      const isExpired = decoded.exp * 1000 < Date.now();
      if (isExpired) {
        toast.error("Session expired. Please login again.");
        localStorage.clear();
        navigate('/');
      }
    }

    try {
      setLoadingUnAllocated(true);
      const response = await axios.get(`${base_URL}/api/RHProjectAssign/NotAllocated/List?empCode=${empCode}`,
        {
          headers: {
            'Authorization': `Bearer ${Token}`
          }
        }
      );

      const formattedData = response.data.data.map((project) => ({
        id: project.Id,
        ProjectCategoryName: project.ProjectCategoryName,
        ProjectName: project.ProjectName,
        isActive: project.IsActive,
        ProjectStartDate: project.ProjectStartDate,
        ProjectEndDate: project.ProjectEndDate,
      }));

      setProjectsList(formattedData);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoadingUnAllocated(false);
    }
  };

  const fetchAllocatedProjects = async () => {
    if (Token) {
      const decoded = jwtDecode(Token);
      const isExpired = decoded.exp * 1000 < Date.now();
      if (isExpired) {
        toast.error("Session expired. Please login again.");
        localStorage.clear();
        navigate('/');
      }
    }

    
    try {
      setLoadingAllocated(true);
      const response = await axios.get(`${base_URL}/api/RHProjectAssign/Allocated/List?empCode=${empCode}`,
        {
          headers: {
            'Authorization': `Bearer ${Token}`
          }
        }
      );

      const formattedData = response.data.data.map((project) => ({
        id: project.Id,
        ProjectCategoryName: project.ProjectCategoryName,
        ProjectName: project.ProjectName,
        isActive: project.IsActive,
        ProjectStartDate: project.ProjectStartDate,
        ProjectEndDate: project.ProjectEndDate,
      }));

      setAllocatedList(formattedData);
      setInitialAllocatedList(formattedData);
    }
    catch (error) {
      console.error("Error fetching projects:", error);
    }
    finally {
      setLoadingAllocated(false);
    }
  };

  const moveItems = (source, destination, setSource, setDestination) => {
    const newDestination = [...destination, ...checked];
    const newSource = source.filter((item) => !checked.some((c) => c.id === item.id));

    setSource(newSource);
    setDestination(newDestination);
    setChecked([]);
    setSelectedFrom(null); // Reset selection lock after moving
  };

  const handleSubmitClick = async () => {

    if (Token) {
      const decoded = jwtDecode(Token);
      const isExpired = decoded.exp * 1000 < Date.now();
      if (isExpired) {
        toast.error("Session expired. Please login again.");
        localStorage.clear();
        navigate('/');
      }
    }

    if (!empCode) {
      toast.warning("Employee Code is missing");
      return;
    }

    if (_.isEqual(allocatedList, initialAllocatedList)) {
      toast.error("No changes detected.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${base_URL}/api/RHProjectAssign/Assign`, 
        {
          empCode: empCode,
          projectList: allocatedList.map((item) => ({ projectId: item.id })),
        },
        {
          headers: {
            'Authorization': `Bearer ${Token}`
          }
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Saved successfully!");
        fetchUnAllocatedProjects();
        fetchAllocatedProjects();
        setChecked([]); // Refresh project lists after submission
      } else {
        throw new Error(`Unexpected response: ${response.status}`);
      }
    }
    catch (error) {
      console.error("Error submitting project assignments:", error);
      if (error.response) {
        // Server responded with a status outside 2xx
        const { status, data } = error.response;
        if (status === 400) {
          toast.error(data.message || "Bad request. Please check your input.");
        } else if (status === 401) {
          toast.error("Unauthorized! Please log in again.");
        } else if (status === 500) {
          toast.error("Server error! Please try again later.");
        } else {
          toast.error(`Error ${status}: ${data.message || "Something went wrong."}`);
        }
      } else if (error.request) {
        // Request was made, but no response received (network issue)
        toast.error("Network error! Please check your connection.");
      } else {
        // Something else happened
        toast.error("An unexpected error occurred.");
      }
    }
    finally {
      setLoading(false);
    }
  };

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

    fetchUnAllocatedProjects();
    fetchAllocatedProjects();
  }, []);

  return (
    <div className="relative">
      {/* CircularProgress overlay when loading */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <CircularProgress color="primary" />
        </div>
      )}

      <div className="flex flex-col items-center justify-center bg-gray-100 p-2 mt-5">
        <Card className="w-full max-w-5xl bg-white shadow-md rounded-md p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center mt-2">
            {/* Unallocated Projects */}
            <Box className="flex flex-col w-full sm:w-1/3 h-[280px]" sx={{ maxWidth: '350px' }}>
              <Typography className="text-dark-purple flex justify-center">All Projects</Typography>

              <List className="border border-gray-300 rounded-md p-1 bg-blue-50 shadow-sm h-full overflow-y-auto text-xs relative">
                {loadingUnAllocated ? (
                  <SkeletonProjects />
                )
                  :
                  projectsList.length === 0 ? (
                    <div className="flex justify-center items-center h-full text-gray-500 text-sm">
                      No projects available
                    </div>
                  )
                    :
                    (
                      projectsList.map((item) => (
                        <ListItem
                          key={item.id}
                          onClick={() => handleToggle(item, "unallocated")}
                          className={`text-dark-purple cursor-pointer hover:bg-gray-200 transition-all rounded-md px-2 py-1 border-b border-gray-300 last:border-b-0 ${selectedFrom && selectedFrom !== "unallocated" ? "pointer-events-none opacity-50" : ""}`}
                          sx={{ padding: "0px" }} // Reduce height and padding
                        >
                          <ListItemIcon className="min-w-[30px]">
                            <Checkbox
                              checked={checked.some((c) => c.id === item.id)}
                              size="small"
                              sx={{ transform: "scale(0.7)" }}
                              disabled={selectedFrom && selectedFrom !== "unallocated"}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="caption" sx={{ fontSize: "0.7rem" }}> {/* Smaller text */}
                                {item.ProjectName}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))
                    )}
              </List>

            </Box>

            {/* Move Buttons */}
            <div className={`flex ${isMobile ? "flex-row" : "flex-col"} items-center gap-2 m-4`}>
              <Button
                variant="contained"
                onClick={() => moveItems(projectsList, allocatedList, setProjectsList, setAllocatedList, "assign")}
                disabled={checked.length === 0 || !checked.some((item) => projectsList.some((p) => p.id === item.id)) || movingDirection === "unassign"}
                sx={{
                  backgroundColor: movingDirection === "unassign" ? "gray" : "#081A51",
                  color: "white",
                }}
              >
                {isMobile ? "↓" : "→"}
              </Button>

              <Button
                variant="contained"
                onClick={() => moveItems(allocatedList, projectsList, setAllocatedList, setProjectsList, "unassign")}
                disabled={checked.length === 0 || !checked.some((item) => allocatedList.some((p) => p.id === item.id)) || movingDirection === "assign"}
                sx={{
                  backgroundColor: movingDirection === "assign" ? "gray" : "#081A51",
                  color: "white",
                }}
              >
                {isMobile ? "↑" : "←"}
              </Button>

            </div>

            {/* Allocated Projects */}
            <Box className="flex flex-col w-full sm:w-1/3 h-[280px]" sx={{ maxWidth: '350px' }}>
              <Typography className="text-dark-purple flex justify-center text-sm font-medium mb-1">My Projects</Typography>

              <List className="text-dark-purple border border-gray-300 rounded-md p-1 bg-blue-50 shadow-sm h-full overflow-y-auto text-xs">
                {loadingAllocated ? (
                  <SkeletonProjects /> // Use the skeleton component
                ) : allocatedList.length === 0 ? (
                  <div className="flex justify-center items-center h-full text-gray-500 text-sm">
                    No allocated projects
                  </div>
                ) : (
                  allocatedList.map((item) => (
                    <ListItem
                      key={item.id}
                      onClick={() => handleToggle(item, "allocated")}
                      className={`cursor-pointer hover:bg-gray-200 transition-all rounded-md border-b border-gray-300 last:border-b-0 ${selectedFrom && selectedFrom !== "allocated" ? "pointer-events-none opacity-50" : ""}`}
                      sx={{ padding: "0px" }}
                    >
                      <ListItemIcon>
                        <Checkbox
                          checked={checked.some((c) => c.id === item.id)}
                          size="small"
                          sx={{ transform: "scale(0.7)" }}
                          disabled={selectedFrom && selectedFrom !== "allocated"}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="caption" sx={{ fontSize: "0.7rem" }}>
                            {item.ProjectName}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))
                )}
              </List>
            </Box>
          </div>


          <div className="flex justify-end mt-4">
            <Button
              variant="outlined"
              onClick={handleSubmitClick}
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
              Submit
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AssignProjects;