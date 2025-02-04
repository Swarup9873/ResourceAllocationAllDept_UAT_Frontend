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



const AssignProjects = () => {
  const [left, setLeft] = useState(["Item 1", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6", "Item 7", "Item 8", "Item 9", "Item 10"]);
  const [right, setRight] = useState([]);
  const [checked, setChecked] = useState([]);
  const [loading,setLoading] = useState(false);

  const isMobile = useMediaQuery("(max-width: 637px)"); // Detect small screens

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

  const handleAssignClick =()=>{
    setLoading(true);

    setTimeout(()=>{
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
      <div className="w-[90%] mx-auto mt-5">
        <Box className="bg-dark-purple text-white py-2 px-4 relative inline-block">
          <Breadcrumbs aria-label="breadcrumb" className="text-white" separator={<span className="text-white">›</span>}>
            <Typography className="text-white">
              Projects
            </Typography>
            <Typography className="text-white">Assign Projects</Typography>
          </Breadcrumbs>

          {/* Arrow Effect */}
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
      
      <div className="flex flex-col items-center justify-center bg-gray-100 p-2 mt-5">

        <Card className="w-full max-w-5xl bg-white shadow-md rounded-md p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
            {/* Left List */}
            <Box className="flex flex-col w-full sm:w-1/3 h-[280px]">
              <Typography className="text-gray-600  mb-1">Select Projects</Typography>

              <List className="border border-gray-300 rounded-md p-1 bg-gray-50 shadow-sm h-full overflow-y-auto text-xs">
                {left.map((item) => (
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
                onClick={() => moveItems(left, right, setLeft, setRight)}
                disabled={checked.length === 0}
                className="bg-dark-purple hover:bg-dark-purple text-white text-xs px-4 py-1 rounded-md shadow-sm"
              >
                {isMobile ? "↓" : "→"}
              </Button>
              <Button
                variant="contained"
                onClick={() => moveItems(right, left, setRight, setLeft)}
                disabled={checked.length === 0}
                className="bg-dark-purple hover:bg-dark-purple text-white text-xs px-4 py-1 rounded-md shadow-sm"
              >
                {isMobile ? "↑" : "←"}
              </Button>
            </div>

            {/* Right List */}
            <Box className="flex flex-col w-full sm:w-1/3 h-[280px]">
              <Typography className="text-gray-600 text-sm font-medium mb-1">Allocated Projects</Typography>
              <List className="border border-gray-300 rounded-md p-1 bg-gray-50 shadow-sm h-full overflow-y-auto text-sm">
                {right.map((item) => (
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
