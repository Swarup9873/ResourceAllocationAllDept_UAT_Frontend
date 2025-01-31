import { useState } from "react";
import { Link } from "react-router-dom";

//images
import logo from "../assets/logo.png";
import control from "../assets/control.png";
import Chart_fill from "../assets/Chart_fill.png";
import User from "../assets/User.png";
import Calendar from "../assets/Calendar.png";
import Folder from "../assets/Folder.png";




const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null); // Track open submenu

  const Menus = [
    { title: "Home", src: Chart_fill, path: "/" },
    {
      title: "Projects",
      src: User,
      gap: true,
      submenus: [
        { title: "Create", path: "/create-proj" },
        { title: "Assign", path: "/assign" },
        { title: "Allocation", path: "/allocate" },
      ],
    },
    {
      title: "Team Member",
      src: Calendar,
      gap: true,
      submenus: [{ title: "List", path: "/list" }],
    },
    { title: "Reports", src: Folder, gap: true, path: "/reports" },
  ];

  // Toggle submenu on click
  const toggleSubmenu = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div
      className={`${
        open ? "w-72" : "w-20"
      } bg-dark-purple h-screen p-5 pt-8 relative duration-300`}
    >
      <img
        src={control}
        className={`absolute cursor-pointer -right-3 top-9 w-7 border-dark-purple
         border-2 rounded-full ${!open && "rotate-180"}`}
        onClick={() => setOpen(!open)}
      />
      <div className="flex gap-x-4 items-center">
        <img
          src={logo}
          className={`cursor-pointer duration-500 ${open && "rotate-[360deg]"}`}
        />
        <h1
          className={`text-white origin-left font-medium text-xl duration-200 ${
            !open && "scale-0"
          }`}
        >
          Menu
        </h1>
      </div>
      <ul className="pt-6">
        {Menus.map((Menu, index) => (
          <div key={index}>
            {/* Main Menu Item */}
            <li
              className={`flex rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 
              ${Menu.gap ? "mt-9" : "mt-2"} ${index === 0 && "bg-light-white"}`}
              onClick={() => Menu.submenus && toggleSubmenu(index)}
            >
              <Link
                to={Menu.path || "#"} // If no path, keep it "#" to prevent errors
                className="flex items-center gap-x-4 w-full"
              >
                <img src={Menu.src} alt={Menu.title} className="w-5 h-5" />
                <span className={`${!open && "hidden"} origin-left duration-200`}>
                  {Menu.title}
                </span>
                {/* Arrow Indicator for Submenus */}
                {Menu.submenus && open && (
                  <span className="ml-auto">{activeIndex === index ? "▲" : "▼"}</span>
                )}
              </Link>
            </li>

            {/* Render Submenu Items if Active */}
            {Menu.submenus && activeIndex === index && open && (
              <ul className="ml-6 transition-all duration-300">
                {Menu.submenus.map((submenu, subIndex) => (
                  <li key={subIndex} className="mt-2">
                    <Link
                      to={submenu.path}
                      className="text-gray-400 hover:text-white text-sm"
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
  );
};

export default Sidebar;
