import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from "../../utils/data";

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const [sideMenuData, setSideMenuData] = useState([]);
  const navigate = useNavigate();

  // FIXED: Proper comparison
  const handleClick = (route) => {
    if (route === "logout") {  // FIXED: Use === and compare to "logout"
      handleLogout();
      return;
    }
    navigate(route);
  };

  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem("token");
    
    // Clear user from context
    clearUser();
    
    // Navigate to login
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    if (user) {
      const menu = user.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA;
      setSideMenuData(menu);
    }
  }, [user]);

  // Show loading or nothing if no user
  if (!user) return null;

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 sticky top-[61px] z-20">
      {/* Profile Section */}
      <div className="flex flex-col items-center justify-center mb-7 pt-5">
        <div className="relative">
          <img
            src={user.profileImageUrl || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name || "User")}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=3b82f6&color=fff`;
            }}
          />
        </div>

        {/* Admin Badge */}
        {user?.role === "admin" && (
          <div className="text-[10px] font-medium text-white bg-primary px-3 py-0.5 rounded mt-2">
            Admin
          </div>
        )}

        {/* User Info */}
        <h5 className="text-gray-950 font-medium leading-6 mt-3">
          {user?.name || "User"}
        </h5>
        <p className="text-[12px] text-gray-500">{user?.email || ""}</p>
      </div>

      {/* Menu Items */}
      <div className="px-2">
        {sideMenuData.map((item, index) => (
          <button
            key={`menu_${index}`} // FIXED: Proper template literal syntax
            onClick={() => handleClick(item.path)}
            className={`w-full flex items-center gap-4 text-[15px] ${
              activeMenu === item.label
                ? "text-primary bg-gradient-to-r from-blue-50/40 to-blue-100/50 border-r-4 border-primary"
                : "text-slate-800 hover:bg-slate-100"
            } py-3 px-6 mb-2 rounded-lg cursor-pointer transition-all duration-200`}
          >
            {item.icon && <item.icon className="text-xl" />}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SideMenu;