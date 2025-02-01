// import Sidebar from "../components/Sidebar";
// import { Outlet } from "react-router-dom";
// import Navbar from "../components/Navbar";



// const MainLayout = () => {
//   return (
//     <div className="h-screen flex flex-col overflow-hidden">

//       <div className="fixed top-0 w-full z-50">
//         <Navbar />
//       </div>

//       <div className="flex flex-1 pt-14 overflow-hidden">
//         <div className="h-screen flex-shrink-0">
//           <Sidebar />
//         </div>

//         <div className="flex-1 p-7 overflow-auto">
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MainLayout;







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
        <Navbar />
      </div>

      {/* Main Wrapper */}
      <div className="flex flex-1 pt-14 overflow-hidden relative">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 transform bg-dark-purple transition-all duration-300
            ${isSidebarOpen ? "w-64 md:w-72" : "w-0 md:w-20"}  
            md:relative md:translate-x-0 
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
        <div className="flex-1 p-7 overflow-auto duration-300">
          <Outlet />
        </div>
      </div>

      {/* Sidebar Toggle Button (Only Visible on Small Screens) */}
      {!isSidebarOpen && ( 
      <button
        className="fixed top-16 left-4 z-50 md:hidden bg-dark-purple text-white p-2 rounded-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        ☰
      </button>
      )}
    </div>
  );
};

export default MainLayout;
