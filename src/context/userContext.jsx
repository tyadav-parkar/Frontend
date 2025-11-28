import React, { createContext, useState, useEffect, useCallback } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // ADDED: useCallback to memoize clearUser
    const clearUser = useCallback(() => {
        setUser(null);
        localStorage.removeItem("token");
    }, []);

    useEffect(() => {
        const accessToken = localStorage.getItem("token");
        if (!accessToken) {
            setLoading(false);
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
                setUser(response.data);
            } catch (error) {
                console.error("User not authenticated", error);
                clearUser();
            } finally {
                setLoading(false);
            }
        };
        
        fetchUser();
    }, [clearUser]); // FIXED: Removed 'user' from dependencies

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem("token", userData.token);
        setLoading(false);
    };

    return (
        <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;