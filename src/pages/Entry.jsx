import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const base_URL = import.meta.env.VITE_BASE_URL;


function Entry() {
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await axios.post(base_URL + "/api/auth/emp/list");
                setOptions(response.data.data);

                
            } catch (error) {
                console.error("Error fetching options:", error);
            }
        };

        fetchOptions();
    }, []);

    const handleProceed = () => {
        const selectedEmp = options.find(emp => emp.EmpCode === selectedOption);

        //console.log({selectedEmp});
        
        if (selectedEmp) {
          localStorage.setItem('username', selectedEmp.EmpName);
          localStorage.setItem('email', selectedEmp.EmailId);
          localStorage.setItem('ECN', selectedEmp.EmpCode);
        }

        if(selectedEmp?.IsModificationAllowed){
          localStorage.setItem('isModAllowed', true)
          navigate('/allocation');
        }
        else{
          localStorage.setItem('isModAllowed', false)
          navigate('/export');
        }
        
    }



return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <label htmlFor="dropdown" className="block text-gray-700 font-medium mb-2">Select an Employee</label>
        <select
          id="dropdown"
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
        >
          <option value="" disabled>Select an employee</option>
          {options.map((option) => (
            <option key={option.EmpCode} value={option.EmpCode}>
              {option.EmpName}
            </option>
          ))}
        </select>
        {selectedOption && (
          <button
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            onClick={handleProceed}
          >
            Go
          </button>
        )}
      </div>
    </div>
);
}


export default Entry;
