import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FolderPlus,
  Download,
  UserCheck
} from "lucide-react";

// mui
import { Tooltip } from "@mui/material";

// images
import logo from "../assets/logo.png";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const location = useLocation(); // Get current route
  const [activeIndex, setActiveIndex] = useState(null); // Track open submenu

  const flag = localStorage.getItem('isModAllowed');

  const MenusReportingHead = [
    {
      title: "Assign Project",
      src: FolderPlus,
      gap: true,
      path: "/assign"
    },
    {
      title: "Project Allocation",
      src: UserCheck,
      gap: true,
      path: "/allocation"
    },
  ];

  const MenusFnA = [
    {
      title: "Units",
      src: FolderPlus,
      gap: true,
      submenus: [
        {
          title: "Cost Centers",
          path: "/cost-centers"
        },
        {
          title: "Projects(Tech)",
          path: "/projects"
        }
      ]
    },
    // {
    //   title: "Cost Centers",
    //   src: FolderPlus,
    //   gap: true,
    //   path: "/cost-centers"
    // },
    {
      title: "Export",
      src: Download,
      gap: true,
      submenus: [
        {
          title: "Export Report (All dept)",
          path: "/export/cc"
        },
        {
          title: "Export Report (Tech)",
          path: "/export/tech"
        }
      ]
    },
    // {
    //   title: "Export",
    //   src: Download,
    //   gap: true,
    //   path: "/export/tech"
    // },
    {
      title: "BU & FU Allocation",
      src: UserCheck,
      gap: true,
      // path: "/allocate",
      submenus: [
        {
          title: "Self Assign Cost Center",
          path: "/assign-cc"
        },
        {
          title: "Cost Center Allocation",
          path: "/cc-allocation"
        },
        {
          title: "BU Allocation",
          path: "/bu-allocation"
        }
      ]
    }
  ];


  const Menus = flag === 'true' ? MenusReportingHead : MenusFnA;

  // Toggle submenu on click
  const toggleSubmenu = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed md:relative bg-dark-purple h-screen p-3 pt-3 duration-300 shadow-lg z-50
        ${isSidebarOpen ? "w-72" : "w-20"} md:w-[${isSidebarOpen ? "18rem" : "5rem"}]`}
      >
        {/* Sidebar Header */}
        <div className="flex gap-x-4 items-center">
          <Tooltip title="Open/Close">
            <img
              src={logo}
              className={`cursor-pointer duration-500 ${isSidebarOpen && "rotate-[360deg]"}`}
              onClick={toggleSidebar}
            />
          </Tooltip>
        </div>

        {/* Sidebar Menu */}
        <ul className="pt-6">
          {Menus.map((Menu, index) => (
            <div
              key={index}
              className="relative"
              onMouseEnter={() => Menu.submenus && setActiveIndex(index)}
              onMouseLeave={() => Menu.submenus && setActiveIndex(null)}
            >
              <Tooltip
                title={!isSidebarOpen ? Menu.title : ""}
                placement="right"
                disableHoverListener={isSidebarOpen}
              >
                <li
                  className={`flex rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 
        ${Menu.gap ? "mt-5" : "mt-2"}
        ${location.pathname.startsWith(Menu.path)
                      ? "bg-light-white text-white"
                      : "bg-transparent"
                    }`}
                >
                  {Menu.submenus ? (
                    <div className="flex items-center gap-x-4 w-full">
                      <Menu.src className="w-5 h-5 text-gray-300" />

                      <span className={`${!isSidebarOpen && "hidden"} duration-200 text-[12px]`}>
                        {Menu.title}
                      </span>

                      {isSidebarOpen && (
                        <span className="ml-auto text-xs">▶</span>
                      )}
                    </div>
                  ) : (
                    <Link to={Menu.path} className="flex items-center gap-x-4 w-full">
                      <Menu.src className="w-5 h-5 text-gray-300" />
                      <span className={`${!isSidebarOpen && "hidden"} duration-200`}>
                        {Menu.title}
                      </span>
                    </Link>
                  )}
                </li>
              </Tooltip>

              {/* SUBMENU */}
              {Menu.submenus && activeIndex === index && (
                <div
                  className={`
                    absolute top-1
                    ${isSidebarOpen ? "left-full" : "left-16"}
                    bg-dark-purple/95 backdrop-blur-md
                    border border-white/10
                    shadow-2xl
                    rounded-xl
                    p-2
                    min-w-[220px]
                    z-50
                    animate-fadeIn
                  `}
                >
                  {Menu.submenus.map((sub, subIndex) => (
                    <Link
                      key={subIndex}
                      to={sub.path}
                      className={`
                        group flex items-center gap-3
                        rounded-lg px-4 py-2.5
                        text-[11px] font-medium
                        transition-all duration-200

                        ${location.pathname === sub.path
                                          ? "bg-light-white text-white shadow-sm"
                                          : "text-gray-300 hover:bg-light-white/70 hover:text-white"
                                        }
                      `}
                    >
                      {/* Dot indicator */}
                      <span
                        className={`
                          h-1.5 w-1.5 rounded-full 
                          ${location.pathname === sub.path
                                            ? "bg-white"
                                            : "bg-gray-400 group-hover:bg-white"
                                          }
                        `}
                      />
                      {sub.title}
                    </Link>
                  ))}
                </div>

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
