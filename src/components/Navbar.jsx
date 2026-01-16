import { useState } from "react";

// Images
import mjLogo from "../assets/mjLogo.png";

//external imports
import { FaSignOutAlt } from "react-icons/fa";
import { Box, Avatar, Typography, Tooltip, useMediaQuery, Popover, Button, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";



const Navbar = ({ isSidebarOpen, setIsSidebarOpen, headerTitle }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const user = localStorage.getItem('username');
  //console.log({user});
  
  const userName = user.split(".")[0];
  const userFirstName = userName.split(" ")[0];

  const isMobile = useMediaQuery("(max-width: 640px)");

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.setItem('authToken', '');
    localStorage.setItem('username', '');
    localStorage.setItem('email', '');
    localStorage.setItem('ECN', '');
    localStorage.setItem('isModAllowed', null);
    navigate("/");
    //window.location.href = "https://estimation.mjunction.in"
  }

  return (
    <div className="bg-dark-purple text-white p-2 flex justify-between items-center h-14">
      {/* Left Section: Logo */}
      <div className="flex items-center">
        <a href='/'>
          <img src={mjLogo} alt="Logo" className="h-14 bg-white" />
        </a>
      </div>

      {!isSidebarOpen && isMobile && (
        <button
          className=" md:hidden bg-dark-purple text-white p-4 rounded-lg"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          ☰
        </button>
      )}

     
      <div className="flex-1 text-center">
        <h1 className="text-lg sm:text-2xl md:text-2xl font-semibold break-words ">{headerTitle}</h1>
      </div>
      

      {/* Right Section: User Icon & Logout Icon */}
      <div className="flex items-center space-x-4">
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title={user}>
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
              {userFirstName.charAt(0).toUpperCase()}
            </Avatar>
          </Tooltip>
          {!isMobile && (
            <Typography variant="body1" >
              {userFirstName}
            </Typography>
          )}
        </Box>

        <IconButton onClick={(event) => handleOpen(event)} color="error">
          <Tooltip title="Logout">
            <button
              color="white"
              size="sm"
              variant="text"
            >

              <FaSignOutAlt className="text-white" size={20} />
            </button>
          </Tooltip>
        </IconButton>

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
            <Typography variant="body2">Are you sure want to Logout?</Typography>
            <Button size="small" onClick={handleLogout} color="error">
              Confirm
            </Button>
          </Box>
        </Popover>
      </div>
    </div>
  );
};

export default Navbar;



