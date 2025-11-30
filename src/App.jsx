import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Admin/Dashboard";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import ManageTasks from "./pages/Admin/ManageTasks";
import CreateTask from "./pages/Admin/CreateTask";
import ManageUsers from "./pages/Admin/ManageUsers";
import DashboardUser from "./pages/User/UserDashboard";
import PrivateRoute from "./routes/PrivateRoute";
import ViewTaskDetails from "./pages/User/ViewTaskDetails";
import MyTasks from "./pages/User/MyTasks";
import UserProvider, { UserContext } from "./context/userContext";
import { Toaster } from "react-hot-toast";

const Root = () => {
  const { user, loading } = useContext(UserContext);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // FIXED: Check for "member" instead of "user"
  return user.role === "admin" ? 
    <Navigate to="/admin/dashboard" replace /> : 
    <Navigate to="/user/dashboard" replace />;
};

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
          
          {/* Admin Routes */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/tasks" element={<ManageTasks />} />
            <Route path="/admin/create-task" element={<CreateTask />} />
            <Route path="/admin/users" element={<ManageUsers />} />
          </Route>
          
          <Route element={<PrivateRoute allowedRoles={["member"]} />}>
            <Route path="/user/dashboard" element={<DashboardUser />} />
            <Route path="/user/tasks" element={<MyTasks />} />
            <Route path="/user/tasks-details/:id" element={<ViewTaskDetails />} />
          </Route>
        </Routes>
      </Router>
      <Toaster
        toastOptions={{
          className:"",
          style:{
                fontSize:"13px"
          },
        }}  
      />
    </UserProvider>
  );
};

export default App;