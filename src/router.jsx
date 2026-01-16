import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import CreateProject from "./pages/CreateProjects";
import AllocateProject from "./pages/AllocateProjects";
import AssignProject from "./pages/AssignProjects"
import AssignCC from "./pages/AssignCC"
import Auth from "./pages/Auth";
import ErrorPage from "./pages/Error";
import Entry from "./pages/Entry";
import ExportExcel from "./pages/ExportExcel"
import ExportExcelAllDept from "./pages/ExportExcelAllDept"
import CCAllocationPage from "./pages/CCAllocationPage";
import BUAllocationPage from "./pages/BUAllocationPage";
import LoginLdap from "./pages/LoginLdap";
import ProtectedRoute from "../ProtectedRoute";
import CostCentersCRUD from "./pages/CostCentersCRUD";

const Router = createBrowserRouter([
  {
    path: "/user-login",
    element: <Entry/>,
  },
  {
    path: "/",
    element: <LoginLdap/>,
  },
  {
    path: "/dashboard", // Base /dashboard goes here and shows ErrorPage
    element: <ErrorPage />,
  },
  {
    // path: "/",
    // element: <MainLayout />,
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "projects", element: <CreateProject /> }, 
      { path: "cost-centers", element: <CostCentersCRUD /> },
      { path: "assign", element: <AssignProject /> },
      { path: "allocation", element: <AllocateProject /> },
      { path: "export/tech", element: <ExportExcel /> },
      { path: "export/cc", element: <ExportExcelAllDept /> },
      { path: "/assign-cc", element: <AssignCC /> },
      { path: "/cc-allocation", element: <CCAllocationPage /> },
      { path: "/bu-allocation", element: <BUAllocationPage /> },
    ],
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);


export default function AppRouter() {
  return <RouterProvider router={Router} />;
}
