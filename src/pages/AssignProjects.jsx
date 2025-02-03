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
  Link,
  useMediaQuery
} from "@mui/material";

const AssignProjects = () => {
  const [left, setLeft] = useState(["Item 1", "Item 2", "Item 3", "Item 4"]);
  const [right, setRight] = useState([]);
  const [checked, setChecked] = useState([]);

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

  return (
    <>
      {/* Breadcrumbs as Page Header */}
      <div className="w-[90%] mx-auto mt-5">
        <Breadcrumbs aria-label="breadcrumb">
          <Typography color="inherit" href="/projects">
            Projects
          </Typography>
          <Typography color="textPrimary">Assign Project</Typography>
        </Breadcrumbs>
      </div>
      <div className="flex flex-col items-center justify-center bg-gray-100 p-2 mt-5">
        {/* <Typography variant="h6" className="text-center text-gray-700 font-medium">
        Assign Projects
      </Typography> */}

        <Card className="w-full max-w-5xl bg-white shadow-md rounded-md p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
            {/* Left List */}
            <Box className="flex flex-col w-full sm:w-1/3 h-[280px]">
              <Typography className="text-gray-600 text-sm font-medium mb-1">Select Project</Typography>
              <List className="border border-gray-300 rounded-md p-1 bg-gray-50 shadow-sm h-full overflow-y-auto text-sm">
                {left.map((item) => (
                  <ListItem
                    key={item}
                    onClick={() => handleToggle(item)}
                    className="cursor-pointer hover:bg-gray-200 transition-all rounded-md"
                  >
                    <ListItemIcon>
                      <Checkbox checked={checked.includes(item)} size="small" />
                    </ListItemIcon>
                    <ListItemText primary={item} />
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
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-1 rounded-md shadow-sm"
              >
                {isMobile ? "↓" : "→"}
              </Button>
              <Button
                variant="contained"
                onClick={() => moveItems(right, left, setRight, setLeft)}
                disabled={checked.length === 0}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-1 rounded-md shadow-sm"
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
                  >
                    <ListItemIcon>
                      <Checkbox checked={checked.includes(item)} size="small" />
                    </ListItemIcon>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </div>

          <div className="flex items-end mt-4">
            <button
              type="button"
              disabled={checked.length === 0}
              className="ml-auto bg-dark-purple cursor-pointer text-white font-sm px-4 py-1 rounded-md"
            >
              Assign
            </button>
          </div>
        </Card>
      </div>
    </>
  );
};

export default AssignProjects;
