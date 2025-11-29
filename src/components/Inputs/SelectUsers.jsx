import React, { useState, useEffect } from "react";
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { LuUsers } from "react-icons/lu";
import Modal from '../layouts/Modal';
import AvatarGroup from "../layouts/AvatarGroup";

const SelectUsers = ({ selectedUsers, setSelectedUsers }) => {
    const [allUsers, setAllUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempSelectedUsers, setTempSelectedUsers] = useState([]);

    // Mock data for testing - Remove this when you have real users
    const MOCK_USERS = [
        {
            _id: "507f1f77bcf86cd799439011",
            name: "John Doe",
            email: "john@example.com",
            profileImageUrl: "https://ui-avatars.com/api/?name=John+Doe&background=3b82f6&color=fff"
        },
        {
            _id: "507f1f77bcf86cd799439012",
            name: "Jane Smith",
            email: "jane@example.com",
            profileImageUrl: "https://ui-avatars.com/api/?name=Jane+Smith&background=8b5cf6&color=fff"
        },
        {
            _id: "507f1f77bcf86cd799439013",
            name: "Mike Johnson",
            email: "mike@example.com",
            profileImageUrl: "https://ui-avatars.com/api/?name=Mike+Johnson&background=10b981&color=fff"
        },
        {
            _id: "507f1f77bcf86cd799439014",
            name: "Sarah Williams",
            email: "sarah@example.com",
            profileImageUrl: "https://ui-avatars.com/api/?name=Sarah+Williams&background=f59e0b&color=fff"
        },
        {
            _id: "507f1f77bcf86cd799439015",
            name: "David Brown",
            email: "david@example.com",
            profileImageUrl: "https://ui-avatars.com/api/?name=David+Brown&background=ef4444&color=fff"
        }
    ];

    const getAllUsers = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
            
            if (response.data?.length > 0) {
                setAllUsers(response.data);
            } else {
                // If no users returned, use mock data
                console.log("Using mock data for testing");
                setAllUsers(MOCK_USERS);
            }
        } catch (error) {
            console.error("Error fetching users, using mock data:", error);
            // On error, use mock data for testing
            setAllUsers(MOCK_USERS);
        }
    };

    const toggleUserSelection = (userId) => {
        setTempSelectedUsers((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };
   
    const handleAssign = () => {
        setSelectedUsers(tempSelectedUsers);
        setIsModalOpen(false);
    };
   
    const selectedUserAvatars = allUsers
        .filter((user) => tempSelectedUsers.includes(user._id))
        .map((user) => user.profileImageUrl);

    useEffect(() => {
        getAllUsers();
    }, []);

    useEffect(() => {
        if (selectedUsers.length === 0) {
            setTempSelectedUsers([]);
        } else {
            setTempSelectedUsers(selectedUsers);
        }
    }, [selectedUsers]);

    return (
        <div className="space-y-4 mt-2">
            {selectedUserAvatars.length === 0 && (
                <button 
                    type="button"
                    className="card-btn" 
                    onClick={() => setIsModalOpen(true)}
                >
                    <LuUsers className="text-sm" /> Add Members
                </button>
            )}
            {selectedUserAvatars.length > 0 && (
                <div className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
                    <AvatarGroup avatars={selectedUserAvatars} maxVisible={3}/>
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Select Users"
            >
                <div className="space-y-4 h-[60vh] overflow-y-auto">
                    {allUsers.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            No users available
                        </div>
                    ) : (
                        allUsers.map((user) => (
                            <div
                                key={user._id}
                                className="flex items-center gap-4 p-3 border-b border-gray-200 hover:bg-gray-50 transition"
                            >
                                <img
                                    src={user.profileImageUrl}
                                    alt={user.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                    onError={(e) => {
                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
                                    }}
                                />
                                <div className="flex-1">
                                    <p className="font-medium text-gray-800">
                                        {user.name}
                                    </p>
                                    <p className="text-[13px] text-gray-500">{user.email}</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={tempSelectedUsers.includes(user._id)}
                                    onChange={() => toggleUserSelection(user._id)}
                                    className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm outline-none cursor-pointer"
                                />
                            </div>
                        ))
                    )}
                </div>
                <div className="flex justify-end gap-4 pt-4 p-4 md:p-5 border-t border-gray-200">
                    <button 
                        type="button"
                        className="card-btn" 
                        onClick={() => setIsModalOpen(false)}
                    >
                        CANCEL
                    </button>
                    <button 
                        type="button"
                        className="card-btn-fill" 
                        onClick={handleAssign}
                    >
                        DONE
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default SelectUsers;