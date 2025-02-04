import React, { useState } from "react";
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
  Breadcrumbs,
  useMediaQuery,
  CircularProgress
} from "@mui/material";

import BreadCrumb from "../components/BreadCrumb";



const AssignProjects = () => {
  const [checked, setChecked] = useState([]);
  const [loading, setLoading] = useState(false);
  const [projectsList, setProjectsList] = useState(["Item 1", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6", "Item 7", "Item 8", "Item 9", "Item 10"]);
  const [allocatedList, setAllocatedList] = useState([]);

  const isMobile = useMediaQuery("(max-width: 640px)"); // Detect small screens

  const handleToggle = (value) => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const moveItems = (source, destination, setSource, setDestination) => {
    const newDestination = destination.concat(checked);
    const newSource = source.filter((item) => !checked.includes(item));

    setSource(newSource);
    setDestination(newDestination);
    setChecked([]);
  };

  const handleAssignClick = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false)
    }, 3000)
  }



  return (
    <div className="relative">
      {/* CircularProgress overlay when loading */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <CircularProgress color="primary" />
        </div>
      )}

      {/* Breadcrumbs as Page Header */}
      <BreadCrumb text1={"Projects"} text2={"Assign Projects"} />

      <div className="flex flex-col items-center justify-center bg-gray-100 p-2 mt-5">

        <Card className="w-full max-w-5xl bg-white shadow-md rounded-md p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
            {/* Left List */}
            <Box className="flex flex-col w-full sm:w-1/3 h-[280px]">
              <Typography className="text-gray-600  mb-1">Select Projects</Typography>

              <List className="border border-gray-300 rounded-md p-1 bg-gray-50 shadow-sm h-full overflow-y-auto text-xs">
                {projectsList.map((item) => (
                  <ListItem
                    key={item}
                    onClick={() => handleToggle(item)}
                    className="cursor-pointer hover:bg-gray-200 transition-all rounded-md px-2 py-1"
                    sx={{ padding: "2px 4px" }} // Reduce height and padding
                  >
                    <ListItemIcon className="min-w-[30px]">
                      <Checkbox checked={checked.includes(item)} size="small" sx={{ transform: "scale(0.7)" }} />
                    </ListItemIcon>
                    <ListItemText primary={item} className="text-xs" />
                  </ListItem>
                ))}
              </List>

            </Box>

            {/* Buttons */}
            <div className={`flex ${isMobile ? "flex-row" : "flex-col"} items-center gap-2`}>
              <Button
                variant="contained"
                onClick={() => moveItems(projectsList, allocatedList, setProjectsList, setAllocatedList)}
                // disabled={checked.length === 0 || !checked.some(item => left.includes(item))} 
                disabled={!checked.some(item => projectsList.includes(item))}
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
                // disabled={checked.length === 0 || !checked.some(item => right.includes(item))}
                disabled={!checked.some(item => allocatedList.includes(item))}
                sx={{
                  backgroundColor: "#081A51",
                  color: "white",
                }}
                className="bg-dark-purple hover:bg-dark-purple text-white text-xs px-4 py-1 rounded-md shadow-sm"
              >
                {isMobile ? "↑" : "←"}
              </Button>
            </div>

            {/* allocatedList List */}
            <Box className="flex flex-col w-full sm:w-1/3 h-[280px]">
              <Typography className="text-gray-600 text-sm font-medium mb-1">Allocated Projects</Typography>
              <List className="border border-gray-300 rounded-md p-1 bg-gray-50 shadow-sm h-full overflow-y-auto text-sm">
                {allocatedList.map((item) => (
                  <ListItem
                    key={item}
                    onClick={() => handleToggle(item)}
                    className="cursor-pointer hover:bg-gray-200 transition-all rounded-md"
                    sx={{ padding: "2px 4px" }}
                  >
                    <ListItemIcon>
                      <Checkbox checked={checked.includes(item)} size="small" sx={{ transform: "scale(0.7)" }} />
                    </ListItemIcon>
                    <ListItemText primary={item} className="text-xs" />
                  </ListItem>
                ))}
              </List>
            </Box>
          </div>

          <div className="flex items-end mt-4">
            <button
              type="button"
              // disabled={checked.length === 0}
              onClick={handleAssignClick}
              className="ml-auto bg-dark-purple cursor-pointer text-white font-sm px-4 py-1 rounded-md"
            >
              Assign
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AssignProjects;
