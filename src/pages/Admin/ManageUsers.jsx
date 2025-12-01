import React from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { useEffect, useState } from "react";
import UserCard from "../../components/Cards/UserCard";

const ManageUsers = () => {
  const [allUsers, setAllUsers] = useState([]);

  const getAllUsers = async () => {
    try {
      // Use the defined path for GET_ALL_USERS (e.g., /api/users)
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);

      if (response.data?.length > 0) {
        setAllUsers(response.data);
      } else {
        setAllUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // *** UPDATED FUNCTION TO HANDLE ROLE CHANGE API CALL ***
  const handleRoleChange = async (userId, newRole) => {
    try {
      // Construct the URL using the function from API_PATHS (e.g., /api/users/update-role/123)
      const updateUrl = API_PATHS.USERS.UPDATE_USER_ROLE(userId);

      const response = await axiosInstance.put(updateUrl, { role: newRole });
      
      // Update the local state with the returned updated user object
      setAllUsers(prevUsers => prevUsers.map(userItem => 
        userItem._id === userId ? response.data.user : userItem
      ));
      
    } catch (err) {
      console.error('Failed to update role:', err.response?.data?.message || err.message);
      // Ensure a friendly error message is displayed
      const errorMessage = err.response?.data?.message || err.message || "An unexpected error occurred";
      alert(`Could not change user role. Error: ${errorMessage}`);
    }
  };

  useEffect(() => {
    getAllUsers();
    return () => {
      // cleanup if needed
    };
  }, []);

  return (
    <DashboardLayout activeMenu="Team Members">
      <div className="mt-5 mb-10">
        <div className="flex md:flex-row md:items-center justify-between">
          <h2 className="text-xl md:text-xl font-medium">Team Members</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {allUsers?.map((user) => (
            // *** PASS THE HANDLER TO THE USER CARD ***
            <UserCard 
              key={user._id} 
              userInfo={user} 
              onRoleChange={handleRoleChange} 
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageUsers;
