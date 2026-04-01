import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import GroupDetails from "./pages/GroupDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route
          path="/login"
          element={
            <ProtectedRoute authPage={true}>
              <Login />
            </ProtectedRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <ProtectedRoute authPage={true}>
              <Signup />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/groups/:groupId"
          element={
            <ProtectedRoute>
              <GroupDetails />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
