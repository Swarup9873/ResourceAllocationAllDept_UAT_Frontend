import React, { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgress} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const base_URL = import.meta.env.VITE_BASE_URL;



const Login = () => {
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmpID, setUserEmpID] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const [usernameError, setUsernameError] = useState("");
  const navigate = useNavigate();



  const handleLogin = async (e) => {
    e.preventDefault();
    setUsernameError('');
    setPasswordError('');

    if (!userName) {
      setUsernameError("Please enter your username");
      return;
    }

    if (!password) {
      setPasswordError("Please enter a password");
      return;
    }

    try {
        setLoading(true);
        const response = await axios.post(`${base_URL}/api/AD/auth`, {
          username: userName,
          password: password
        });

        //console.log("Response Data:", response);

      if (response?.data?.isSuccess && response.status == 200) {
        const empId = response.data.data.Ecn; // Access empId from the nested EmpID object

        console.log({empId})
        localStorage.setItem('username', userName);
        localStorage.setItem('authToken', response.data.data.Token);
        // localStorage.setItem('token', response.data.authToken);
        localStorage.setItem('empId', empId);
        localStorage.setItem('ECN', empId);
        setLoggedIn(true);

        
        

        // if(response?.data?.data.IsModificationAllowed === true){
        //     localStorage.setItem('isModAllowed', true)
        //     navigate('/dashboard/assign');
        // }
        // else{
        //     localStorage.setItem('isModAllowed', false)
        //     navigate('/dashboard/export');
        // }

        if(response?.data?.data.IsModificationAllowed === true){
          localStorage.setItem('isModAllowed', true)
          navigate('/allocation');
      }
      else{
          localStorage.setItem('isModAllowed', false)
          navigate('/export/tech');
      }

      } 
      else {
        toast.error(response.returnMessage);
      }
    } 
    catch (err) {
        console.log(err);
        toast.error("Login error:" + err.message);
    }
    finally{
      setLoading(false);
    }
  };


  useEffect(() => {
    const handleLogout = () => {
      localStorage.setItem('userName', '');
      localStorage.setItem("empId", '')
      localStorage.setItem('emailId', '');
      localStorage.setItem('userName', '');
      localStorage.setItem('isModAllowed', null);
    }

    handleLogout();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-center text-2xl font-semibold text-dark-purple mb-4">
          Employee Login
        </h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 font-medium">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Username"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
            {usernameError && <p className="text-red-500 text-sm mt-1">{usernameError}</p>}
          </div>
          {/* <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
          </div> */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-medium">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"} // 👈 Toggle type
              id="password"
              name="password"
              placeholder="Password"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}

            {/* Show/Hide toggle */}
            <div className="mt-2">
              <label className="text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                  className="mr-2"
                />
                Show Password
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-dark-purple text-white py-2 rounded-lg transition duration-200"
          >
            
            {loading ? (
                <CircularProgress size={18} sx={{ mr: 1, color: 'white' }} />
            ) : (
                <>Sign in</>
            )}
          </button>
        </form>
      </div>
    </div>
  );  
};

export default Login;
