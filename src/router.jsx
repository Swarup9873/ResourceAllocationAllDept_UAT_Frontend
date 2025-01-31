import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import CreateProject from "./pages/CreateProjects";
import AllocateProject from "./pages/AllocateProjects";
import AssignProject from "./pages/AssignProjects"
import TeamMember from "./pages/TeamMember"
import List from "./pages/List"
import Reports from "./pages/Reports"


const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "assign", element: <AssignProject /> },
      { path: "create-proj", element: <CreateProject /> },
      { path: "allocate", element: <AllocateProject /> },
      { path: "members", element: <TeamMember /> },
      { path: "list", element: <List /> },
      { path: "reports", element: <Reports /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
