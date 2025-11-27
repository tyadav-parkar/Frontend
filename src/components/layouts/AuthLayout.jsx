import React from 'react'
import bg_img from "../../assets/images/bg_img.png"
const AuthLayout = ({ children }) => {
  return (
    <div className="flex">
      <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12">
            <h2 className="text-lg font-medium text-black">Task Manager</h2>
                {children}
        </div>
        <div className="hidden md:flex md:flex w-[40vw] h-screen items-center justify-center bg-blue-50 bg-[url('/bgimg)]' bg-cover bg-no-repeat bg-center overflow-hidden">
            <img src={bg_img} className="w-64 lg:w-[90%] " />
        </div>
    </div>
  );
};

export default AuthLayout;