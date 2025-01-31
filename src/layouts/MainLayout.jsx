import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar"

const MainLayout = () => {
  return (
    // <div className="flex h-screen">
    //   <Sidebar />
    //   <div className="h-screen flex-1 p-7 overflow-auto">
    //     <Outlet />
    //   </div>
    // </div>
    <div className="flex flex-col h-screen">
      {/* Navbar at the top */}
      <Navbar />
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />
        <div className="h-full flex-1 p-7">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
