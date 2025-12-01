import React from 'react';
// Import icons for the role change button
import { HiOutlineUserAdd, HiOutlineUserRemove } from 'react-icons/hi';

/**
 * Renders a single user card with stats and an admin role-change button.
 * @param {object} props
 * @param {object} props.userInfo - The user data object (e.g., name, email, role, task counts)
 * @param {function} props.onRoleChange - The handler function called when the role button is clicked
 */
const UserCard = ({ userInfo, onRoleChange }) => {

    const toggleRole = () => {
        // Determine the new role based on the current role
        const newRole = userInfo.role === 'admin' ? 'user' : 'admin';
        // Call the parent handler function, passing the user ID and the intended new role
        if (onRoleChange) {
            onRoleChange(userInfo._id, newRole);
        }
    };
    
    return (
        <div className="user-card p-2 border rounded-lg bg-white shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img
                        src={userInfo?.profileImageUrl || null}
                        alt="Avatar"
                        className="w-12 h-12 rounded-full border-2 border-white object-cover"
                    />
                    <div>
                        <p className="text-sm font-medium">{userInfo?.name}</p>
                        <p className="text-xs text-gray-500">{userInfo?.email}</p>
                        {/* Display the current role with conditional styling */}
                        <span className={`text-xs font-semibold mt-1 inline-block px-2 py-0.5 rounded-full ${userInfo.role === 'admin' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'}`}>
                            {userInfo.role}
                        </span>
                    </div>
                </div>
                
                {/* *** THE ADMIN ROLE CHANGE BUTTON *** */}
                {/* This button toggles the role using the handler passed from the parent (ManageUsers.jsx) */}
                <button 
                    onClick={toggleRole}
                    className={`p-2 rounded-full transition-colors duration-200 ${
                        userInfo.role === 'admin' 
                        ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                    }`}
                    title={userInfo.role === 'admin' ? "Demote to User" : "Promote to Admin"}
                    type="button"
                >
                    {userInfo.role === 'admin' ? <HiOutlineUserRemove className="w-5 h-5" /> : <HiOutlineUserAdd className="w-5 h-5" />}
                </button>

            </div>

            {/* Task Statistics Section */}
            <div className="flex items-end gap-3 mt-5">
                <StatCard label="Pending" count={userInfo?.pendingTasks || 0} status="Pending" />
                <StatCard label="In Progress" count={userInfo?.inProgressTasks || 0} status="In Progress" />
                <StatCard label="Completed" count={userInfo?.completedTasks || 0} status="Completed" />
            </div>
        </div>
    );
};

export default UserCard;


/**
 * Helper component for displaying a single statistic count and label.
 */
const StatCard = ({ label, count, status }) => {
  const getStatusTagColor = () => {
    switch (status) {
      case 'In Progress':
        return 'text-cyan-600 bg-gray-50';
      case 'Completed':
        return 'text-indigo-600 bg-gray-50';
      default:
        // Default color for "Pending" or any other status
        return 'text-violet-600 bg-gray-50';
    }
  };

  return (
    <div className={`flex-1 text-[10px] font-medium ${getStatusTagColor()} px-4 py-2 rounded`}>
      <span className="text-[12px] font-semibold">{count}</span>
      <br /> {label}
    </div>
  );
};
