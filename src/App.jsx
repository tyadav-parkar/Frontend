import React from "react";
import { BrowserRouter as Router, Routes, Route, Outlet ,Navigate } from "react-router-dom";
import Dashboard from "./pages/Admin/Dashboard";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import ManageTasks from "./pages/Admin/ManageTasks";
import CreateTask from "./pages/Admin/CreateTask";
import ManageUsers from "./pages/Admin/ManageUsers";
import DashboardUser from "./pages/User/DashboardUser";
import PrivateRoute from "./routes/PrivateRoute";
import ViewTaskDetails from "./pages/User/ViewTaskDetails";
import MyTasks from "./pages/User/MyTasks"
import { useContext } from "react";
import UserProvider, { UserContext } from "./context/userContext";

const App = () => {
return (
  <div>
    <UserProvider>
      <Router>
          <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signUp" element={<SignUp />} />
              {/* Admin Routes */}
            <Route element={<PrivateRoute allowedRoles={ ["admin"]} />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/tasks" element={<ManageTasks />} />
              <Route path="/admin/create-task" element={<CreateTask />} />
              <Route path="/admin/users" element={<ManageUsers />} />
            </Route>
            {/* User Routes  */}
            <Route element={<PrivateRoute allowedRoles={ ["users"]} />}>
              <Route path="/user/dashboard" element={<DashboardUser />} />
              <Route path="/user/tasks" element={<MyTasks />} />
              <Route path="/user/tasks-details/:id" element={<ViewTaskDetails />} />
            </Route>
          </Routes>
      </Router>
      </UserProvider>
  </div>
)};
export default App;

const Root=()=>{
  const {user, loading}=useContext(UserContext);
  if(loading) return <Outlet/>;

  if(!user){
    return <Navigate to="/login"/>;
  }
  return user.role === "admin" ? <Navigate to="/admin/dashboard"/> : <Navigate to="/user/dashboard"/>;

}