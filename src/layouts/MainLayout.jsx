import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default: Hidden on mobile

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Fixed Navbar */}
      <div className="fixed top-0 w-full z-50">
        <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      </div>

      {/* Main Wrapper */}
      <div className="flex flex-1 pt-14 overflow-hidden relative">
        {/* Sidebar */}

        {/* <div
          className={`fixed inset-y-0 left-0 z-50 transform bg-dark-purple transition-all duration-300
            ${isSidebarOpen ? "w-64 sm:w-72" : "w-20 sm:w-20"}  
            sm:relative sm:translate-x-0 
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        >
          <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        </div> */}

<div
          className={`fixed inset-y-0 left-0 z-50 transform bg-dark-purple transition-all duration-300
            ${isSidebarOpen ? "w-64 sm:w-72" : "w-20 sm:w-20"}  
            sm:relative sm:translate-x-0 
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        >
          <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        </div>


        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content (Expands when sidebar is hidden) */}
        <div className="flex-1 overflow-auto duration-300">
          <Outlet />
        </div>
      </div>

    </div>
  );
};

export default MainLayout;
