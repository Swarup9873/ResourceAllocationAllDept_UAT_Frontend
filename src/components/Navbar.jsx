import { useState } from "react";

// Images
import mjLogo from "../assets/mjLogo.png";

// Icons from react-icons
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa"; 

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen(!open);

  return (
    <div className="bg-dark-purple text-white p-2 flex justify-between items-center h-14">
      {/* Left Section: Logo */}
      <div className="flex items-center">
        <img src={mjLogo} alt="Logo" className="h-10 bg-white rounded-full" />
      </div>

      {/* Center Section: Application Tracker */}
      <div className="flex-1 text-center">
        <h1 className="text-xl">Application Tracker</h1>
      </div>

      {/* Right Section: User Icon & Logout Icon */}
      <div className="flex items-center space-x-4">
        <button
          color="white"
          size="sm"
          variant="text"
          onClick={() => console.log("User Clicked")}
        >
          <FaUserCircle className="text-white" size={24} />
        </button>
        <button
          color="white"
          size="sm"
          variant="text"
          onClick={() => console.log("Logout Clicked")}
        >
          <FaSignOutAlt className="text-white" size={24} />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
