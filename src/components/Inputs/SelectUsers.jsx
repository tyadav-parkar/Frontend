import React, { useState, useEffect } from "react";
// import axiosInstance from './axiosInstance';
// import { API_PATHS } from './apiPaths';
import { LuUsers } from "react-icons/lu";
// Assuming Modal component is imported from a separate file
import Modal from '../layouts/Modal';
import AvatarGroup from "../layouts/AvatarGroup";
 
 
const SelectUsers = ({ selectedUsers, setSelectedUsers }) => {
    const [allUsers, setAllUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); // Changed default to false
    const [tempSelectedUsers, setTempSelectedUsers] = useState([]);
 
    const getAllUsers = async () => {
        try {
            // Placeholder for the actual API call logic
            // const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
            // Example static data:
            const response = {
                data: [
                    { id: '1', _id: '1', name: 'User A', profileImageUrl: 'url_a', email: 'a@example.com' },
                    { id: '2', _id: '2', name: 'User B', profileImageUrl: 'url_b', email: 'b@example.com' },
                ]
            };
 
            if (response.data?.length > 0) {
                setAllUsers(response.data);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
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
   
    // This logic runs every render, calculating avatars based on current temp selection
    const selectedUserAvatars = allUsers
        .filter((user) => tempSelectedUsers.includes(user._id))
        .map((user) => user.profileImageUrl);
 
    console.log("Assigned user avatars:", selectedUserAvatars);
 
 
    // UseEffect hooks need to be at the top level of the component body
    useEffect(() => {
        // getAllUsers(); // Uncomment this line when axiosInstance and API_PATHS are properly set up
        setAllUsers([ // Temporary data for demonstration since axios is commented out
            { id: '1', _id: '1', name: 'User A', profileImageUrl: 'url_a', email: 'a@example.com' },
            { id: '2', _id: '2', name: 'User B', profileImageUrl: 'url_b', email: 'b@example.com' },
        ]);
    }, []);
 
    useEffect(() => {
        if (selectedUsers.length === 0) {
            setTempSelectedUsers([]);
        } else {
            // When props change, sync temp state if necessary
            setTempSelectedUsers(selectedUsers);
        }
    }, [selectedUsers]);
 
 
    return (
        <div className="space-y-4 mt-2">
            {/* Corrected spacing in length check */}
            {selectedUserAvatars.length === 0 && (
                <button className="card-btn" onClick={() => setIsModalOpen(true)}>
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
                    {allUsers.map((user) => (
                        <div
                            key={user._id}
                            className="flex items-center gap-4 p-3 border-b border-gray-200"
                        >
                            <img
                                src={user.profileImageUrl}
                                alt={user.name}
                                className="w-10 h-10 rounded-full"
                            />
                            <div className="flex-1">
                                <p className="font-medium text-gray-800 dark:text-white">
                                    {user.name}
                                </p>
                                <p className="text-[13px] text-gray-500">{user.email}</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={tempSelectedUsers.includes(user._id)}
                                onChange={() => toggleUserSelection(user._id)}
                                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm outline-none"
                            />
                        </div>
                    ))}
                </div>
                {/* Modal Footer */}
                <div className="flex justify-end gap-4 pt-4 p-4 md:p-5 border-t border-gray-200">
                    <button className="card-btn" onClick={() => setIsModalOpen(false)}>
                        CANCEL
                    </button>
                    {/* Corrected button tag syntax */}
                    <button className="card-btn-fill" onClick={handleAssign}>
                        DONE
                    </button>
                </div>
            </Modal>
        </div>
    );
};
 
export default SelectUsers;
 
 