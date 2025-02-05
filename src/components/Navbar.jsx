import { useState } from "react";

// Images
import mjLogo from "../assets/mjLogo.png";

//external imports
import { FaSignOutAlt } from "react-icons/fa";
import { Box, Avatar, Typography, Tooltip, useMediaQuery } from "@mui/material";

const Navbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [open, setOpen] = useState(false);
  const userName = "Swarup";

  const isMobile = useMediaQuery("(max-width: 640px)");

  return (
    <div className="bg-dark-purple text-white p-2 flex justify-between items-center h-14">
      {/* Left Section: Logo */}
      <div className="flex items-center">
        <img src={mjLogo} alt="Logo" className="h-14 bg-white" />
      </div>

      {!isSidebarOpen && isMobile && (
        <button
          className=" md:hidden bg-dark-purple text-white p-4 rounded-lg"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          ☰
        </button>
      )}

      {/* Center Section: Application Tracker */}
      <div className="flex-1 text-center">
        <h1 className="text-xl break-words ">Resource Allocation</h1>
      </div>

      {/* Right Section: User Icon & Logout Icon */}
      <div className="flex items-center space-x-4">
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title={userName}>
            <Avatar
              sx={{
                bgcolor: "transparent", // Transparent background
                border: "1px solid", // Add a border
                mr: 1,
                width: 30, // Smaller width
                height: 30,
                fontSize: 16,
              }}
            >
              {userName.charAt(0).toUpperCase()}
            </Avatar>
          </Tooltip>
          {!isMobile && (
          <Typography variant="body1" >
            {userName}
          </Typography>
          )}
        </Box>

        <Tooltip title="Logout">
          <button
            color="white"
            size="sm"
            variant="text"
          >

            <FaSignOutAlt className="text-white" size={20} />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default Navbar;



