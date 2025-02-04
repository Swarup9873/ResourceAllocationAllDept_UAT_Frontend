import { useState } from "react";
import { Link } from "react-router-dom";

// mui
import { Tooltip } from "@mui/material";

// images
import logo from "../assets/logo.png";
import control from "../assets/control.png";
import Chart_fill from "../assets/Chart_fill.png";
import User from "../assets/User.png";
import Calendar from "../assets/Calendar.png";
import Folder from "../assets/Folder.png";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const [activeIndex, setActiveIndex] = useState(null); // Track open submenu

  const Menus = [
    { title: "Dashboard", src: Chart_fill, path: "/" },
    {
      title: "Projects",
      src: Calendar,
      gap: true,
      submenus: [
        { title: "Create", path: "/create-proj" },
        { title: "Assign", path: "/assign" },
        { title: "Allocation", path: "/allocate" },
      ],
    },
    {
      title: "Team Member",
      src: User,
      gap: true,
      submenus: [{ title: "List", path: "/list" }],
    },
    { title: "Reports", src: Folder, gap: true, path: "/reports" },
  ];

  // Toggle submenu on click
  const toggleSubmenu = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Handle menu item selection
  const handleMenuClick = (path) => {
    // Close the sidebar
    toggleSidebar();
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed md:relative bg-dark-purple h-screen p-5 pt-8 duration-300 shadow-lg z-50
        ${isSidebarOpen ? "w-72" : "w-20"} md:w-[${isSidebarOpen ? "18rem" : "5rem"}]`}
      >
        {/* Sidebar Toggle Button (Larger Screens) */}
        <img
          src={control}
          className={`absolute cursor-pointer -right-3 top-9 w-7 border-dark-purple
         border-2 rounded-full ${!isSidebarOpen && "rotate-180"}`}
          onClick={toggleSidebar}
        />

        {/* Sidebar Header */}
        <div className="flex gap-x-4 items-center">
          <img
            src={logo}
            className={`cursor-pointer duration-500 ${isSidebarOpen && "rotate-[360deg]"}`}
          />
        </div>

        {/* Sidebar Menu */}
        <ul className="pt-6">
          {Menus.map((Menu, index) => (
            <div key={index}>
              {/* Main Menu Item */}
              <Tooltip title={!isSidebarOpen ? Menu.title : ""} placement="right">
                <li
                  className={`flex rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 
              ${Menu.gap ? "mt-9" : "mt-2"} ${index === 0 && "bg-light-white"}`}
                  onClick={() => {
                    if (Menu.submenus) {
                      toggleSubmenu(index);
                    } else {
                      handleMenuClick(Menu.path); // Close sidebar on click
                    }
                  }}
                >
                  <Link to={Menu.path || "#"} className="flex items-center gap-x-4 w-full">
                    <img src={Menu.src} alt={Menu.title} className="w-5 h-5" />
                    <span className={`${!isSidebarOpen && "hidden"} origin-left duration-200`}>
                      {Menu.title}
                    </span>

                    {/* Arrow Indicator for Submenus */}
                    {Menu.submenus && isSidebarOpen && (
                      <span className="ml-auto">{activeIndex === index ? "▲" : "▼"}</span>
                    )}
                  </Link>
                </li>
              </Tooltip>

              {/* Render Submenu Items if Active */}
              {Menu.submenus && activeIndex === index && isSidebarOpen && (
                <ul className="ml-6 transition-all duration-300">
                  {Menu.submenus.map((submenu, subIndex) => (
                    <li key={subIndex} className="mt-2">
                      <Link
                        to={submenu.path}
                        className="text-gray-400 hover:text-white text-sm"
                        onClick={() => handleMenuClick(submenu.path)} // Close sidebar on submenu click
                      >
                        - {submenu.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </ul>
      </div>

      {/* Overlay for Small Screens */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
