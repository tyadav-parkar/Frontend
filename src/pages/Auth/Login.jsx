import React, { useContext, useState } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import { useNavigate, Link } from "react-router-dom";
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import axiosInstance from "../../utils/axiosInstance";
import { UserContext } from '../../context/userContext';
import { API_PATHS } from '../../utils/apiPaths';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);

  // Handle Login Form Submit
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    
    if (!password) {
      setError("Please enter the password");
      return;
    }
    
    setError("");
    
    // Login API Call
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      
      const { token, role } = response.data;
      console.log("User role:", role);
      
      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        
        // FIXED: Use else if and check for "member"
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else if (role === "member") {
          navigate("/user/dashboard");
        } else {
          setError("Unknown user role");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong");
      }
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Please enter your details to log in
        </p>
        <form onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="john@example.com"
            type="text"
          />
          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="Min 8 Characters"
            type="password"
          />
          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
          <button type="submit" className="btn-primary">
            LOGIN
          </button>
          <p className="text-[13px] text-slate-800 mt-3">
            Don't have an account?{" "}
            <Link className="font-medium text-primary underline" to="/signUp">
              SignUp
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;