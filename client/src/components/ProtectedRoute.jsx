import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, authPage = false }) {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  const isLoggedIn = token && user;

  // for login/signup pages
  if (authPage && isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  // for private pages
  if (!authPage && !isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;