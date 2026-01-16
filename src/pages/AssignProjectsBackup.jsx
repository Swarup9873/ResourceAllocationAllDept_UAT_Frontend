import React, { useEffect, useState } from "react";
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

const base_URL = import.meta.env.VITE_BASE_URL;

const AssignProjects = () => {
  const [checked, setChecked] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingUnAllocated, setLoadingUnAllocated] = useState(false);
  const [loadingAllocated, setLoadingAllocated] = useState(false);
  const [projectsList, setProjectsList] = useState([]);
  const [allocatedList, setAllocatedList] = useState([]);
  const [initialAllocatedList, setInitialAllocatedList] = useState([]);

  //const EmpCode = localStorage.getItem("empCode");

  const isMobile = useMediaQuery("(max-width: 640px)"); // Detect small screens

  const handleToggle = (value) => {
    const currentIndex = checked.findIndex((item) => item.id === value.id);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const moveItems = (source, destination, setSource, setDestination) => {
    const newDestination = [...destination, ...checked];
    const newSource = source.filter((item) => !checked.some((c) => c.id === item.id));

    setSource(newSource);
    setDestination(newDestination);
    setChecked([]);
  };

  const handleSubmitClick = async () => {
    if (allocatedList.length === initialAllocatedList.length) {
      toast.error("No changes detected.");
      return;
    }
  
    setLoading(true);
  
    // Identify newly assigned projects (moved to Allocated List)
    const newlyAssignedProjects = allocatedList.filter(
      (item) => !initialAllocatedList.some((p) => p.id === item.id)
    );
  
    // Identify newly unassigned projects (moved back to Unallocated List)
    const newlyUnassignedProjects = initialAllocatedList.filter(
      (item) => !allocatedList.some((p) => p.id === item.id)
    );
  
    try {
      // Assign new projects
      if (newlyAssignedProjects.length > 0) {
        await axios.post(`${base_URL}/api/RHProjectAssign/Assign`, {
          empCode: "60", // Replace with actual empCode if needed
          projectList: newlyAssignedProjects.map((item) => ({ projectId: item.id })),
        });
        toast.success("Projects assigned successfully!");
      }
  
      // Unassign removed projects
      if (newlyUnassignedProjects.length > 0) {
        const projectList2 = newlyUnassignedProjects.map((item) => ({ projectId: item.id }));
        console.log({projectList2});
        
        await axios.post(`${base_URL}/api/RHProjectAssign/Assign`, {
          empCode: "60", // Replace with actual empCode if needed
          projectList: newlyUnassignedProjects.map((item) => ({ projectId: item.id })),
        });
        toast.success("Projects unassigned successfully!");
      }
  
      // Refresh project lists after submission
      setChecked([]);
    } catch (error) {
      console.error("Error submitting project assignments:", error);
      toast.error("An error occurred while updating project assignments.");
    } finally {
      setLoading(false);
    }
  };

  

  useEffect(() => {
    const fetchUnAllocatedProjects = async () => {
      try {
        setLoadingUnAllocated(true);
        const response = await axios.get(`${base_URL}/api/RHProjectAssign/NotAllocated/List`);

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
      try {
        setLoadingAllocated(true);
        const response = await axios.get(`${base_URL}/api/RHProjectAssign/Allocated/List`);

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
              <Typography className="text-dark-purple flex justify-center mb-1">Select Projects</Typography>

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
                          onClick={() => handleToggle(item)}
                          className="text-dark-purple cursor-pointer hover:bg-gray-200 transition-all rounded-md px-2 py-1 border-b border-gray-300 last:border-b-0"
                          sx={{ padding: "0px" }} // Reduce height and padding
                        >
                          <ListItemIcon className="min-w-[30px]">
                            <Checkbox checked={checked.some((c) => c.id === item.id)} size="small" sx={{ transform: "scale(0.7)" }} />
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
                onClick={() => moveItems(projectsList, allocatedList, setProjectsList, setAllocatedList)}
                disabled={checked.length === 0 || !checked.some((item) => projectsList.some((p) => p.id === item.id))}
                sx={{
                  backgroundColor: "#081A51",
                  color: "white",
                }}
                className="bg-dark-purple hover:bg-dark-purple text-white text-xs px-4 py-1 rounded-md shadow-sm"
              >
                {isMobile ? "↓" : "→"}
              </Button>
              <Button
                variant="contained"
                onClick={() => moveItems(allocatedList, projectsList, setAllocatedList, setProjectsList)}
                disabled={checked.length === 0 || !checked.some((item) => allocatedList.some((p) => p.id === item.id))}
                sx={{
                  backgroundColor: "#081A51",
                  color: "white",
                }}
                className="bg-dark-purple hover:bg-dark-purple text-white text-xs px-4 py-1 rounded-md shadow-sm"
              >
                {isMobile ? "↑" : "←"}
              </Button>
            </div>

            {/* Allocated Projects */}
            <Box className="flex flex-col w-full sm:w-1/3 h-[280px]" sx={{ maxWidth: '350px' }}>
              <Typography className="text-dark-purple flex justify-center text-sm font-medium mb-1">Allocated Projects</Typography>

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
                      onClick={() => handleToggle(item)}
                      className="cursor-pointer hover:bg-gray-200 transition-all rounded-md border-b border-gray-300 last:border-b-0"
                      sx={{ padding: "0px" }}
                    >
                      <ListItemIcon>
                        <Checkbox checked={checked.some((c) => c.id === item.id)} size="small" sx={{ transform: "scale(0.7)" }} />
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