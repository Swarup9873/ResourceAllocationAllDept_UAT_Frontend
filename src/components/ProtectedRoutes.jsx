import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  //const user = localStorage.getItem("ECN");
  const Token = localStorage.getItem("authToken");

  return Token ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
