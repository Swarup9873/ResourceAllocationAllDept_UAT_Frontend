import { useState } from "react";
import { toast } from "react-toastify";
import { CircularProgress } from '@mui/material';
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router-dom";


const base_URL = import.meta.env.VITE_BASE_URL;

const CreateCCModal = ({ open, handleClose, setRefresh }) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        DeptName: "",
        DepartmentType: "",
        CC_Code: 0,
    });

    const empCode = localStorage.getItem('ECN')
    const Token = localStorage.getItem('authToken')

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (Token) {
            const decoded = jwtDecode(Token);
            const isExpired = decoded.exp * 1000 < Date.now();
            if (isExpired) {
                toast.error("Session expired. Please login again.");
                localStorage.clear();
                navigate('/');
            }
        }

        setLoading(true);

        try {
            const response = await axios.post(`${base_URL}/api/CCMaster/Create/CC`, {
                cC_Code: formData.CC_Code,
                deptName: formData.DeptName,
                departmentType: formData.DepartmentType,
                createdBy: empCode.toString()
            },
                {
                    headers: {
                        'Authorization': `Bearer ${Token}`
                    }
                }
            );             

            if (response.status === 201 || response.status === 200) {
                setRefresh(true);
                toast.success("cost center created successfully!");

                setFormData({
                    CC_Code: null,
                    DeptName: "",
                    DepartmentType: ""
                })
                handleClose();
            }
            else {
                toast.error("Failed to create cost center", response.returnMessage);
            }
        }
        catch (err) {
            const errorMessage = err.response.data.returnMessage;
            toast.error(errorMessage);
            console.error("Error creating cost center:", err.response.data.returnMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        // <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={handleClose}>
        //     {loading && (
        //         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        //             <CircularProgress color="primary" />
        //         </div>
        //     )}
        //     <div className="bg-white  max-w-sm rounded-md shadow-lg p-6 font-[Inter,sans-serif]" onClick={(e) => e.stopPropagation()}>
        //         <h2 className="text-center text-lg font-semibold text-dark-purple">Create New Cost Center</h2>
        //         <form onSubmit={handleSubmit} className=" text-xs font-xs space-y-4 mt-4">
        //             {/* Department Type */}
        //             <div>
        //                 <label className="block text-gray-700">Cost Center Type*</label>
        //                 <select
        //                     name="DepartmentType"
        //                     value={formData.DepartmentType}
        //                     onChange={handleChange}
        //                     required
        //                     className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        //                 >
        //                     <option value="">-- Select Type --</option>
        //                     <option value="FU">FU</option>
        //                     <option value="BU">BU</option>
        //                     <option value="Branch">Branch</option>
        //                 </select>
        //             </div>

        //             {/* Dept Name */}
        //             <div>
        //                 <label className="block text-gray-700">Department Name*</label>
        //                 <input
        //                     type="text"
        //                     name="DeptName"
        //                     value={formData.DeptName}
        //                     onChange={handleChange}
        //                     required
        //                     placeholder="Enter Department name"
        //                     className=" w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        //                 />
        //             </div>

        //             {/* Enter Cost center code */}
        //             <div>
        //                 <label className="block text-gray-700">CC Code</label>
        //                 <input
        //                     type="number"
        //                     name="CC_Code"
        //                     value={formData.CC_Code}
        //                     onChange={handleChange}
        //                     placeholder="Enter CC Code"
        //                     className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        //                 />
        //             </div>

        //             {/* Buttons */}
        //             <div className="flex justify-between mt-4 space-x-3">
        //                 <button
        //                     type="button"
        //                     onClick={handleClose}
        //                     className="px-3 py-1 bg-gray-400 text-white rounded-sm hover:bg-gray-500 transition hover:scale-110"
        //                 >
        //                     Cancel
        //                 </button>
        //                 <button
        //                     type="submit"
        //                     className="px-3 py-2 bg-dark-purple text-white rounded-sm transition hover:scale-110"
        //                     disabled={loading}
        //                 >
        //                     {loading ? "Creating..." : "Create"}
        //                 </button>
        //             </div>
        //         </form>
        //     </div>
        // </div>




        <div
  className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50 transition-opacity duration-300"
  onClick={handleClose}
>
  {loading && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <CircularProgress color="primary" />
    </div>
  )}

  <div
    className="bg-white max-w-md w-full rounded-2xl shadow-2xl p-8 font-sans relative transform transition-transform duration-300 hover:scale-[1.02]"
    onClick={(e) => e.stopPropagation()}
  >
    {/* Header */}
    <h2 className="text-center text-2xl font-bold text-dark-purple mb-6">
      Create New Cost Center
    </h2>

    <form onSubmit={handleSubmit} className="space-y-5 text-sm">
      {/* Department Type */}
      <div>
        <label className="block text-gray-600 mb-1 font-medium">Cost Center Type*</label>
        <select
          name="DepartmentType"
          value={formData.DepartmentType}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-purple-300 outline-none transition duration-200 hover:border-purple-300"
        >
          <option value="">-- Select Type --</option>
          <option value="FU">FU</option>
          <option value="BU">BU</option>
          <option value="Branch">Branch</option>
        </select>
      </div>

      {/* Dept Name */}
      <div>
        <label className="block text-gray-600 mb-1 font-medium">Cost Center Name*</label>
        <input
          type="text"
          name="DeptName"
          value={formData.DeptName}
          onChange={handleChange}
          required
          placeholder="Enter Cost Center name"
          className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-purple-300 outline-none transition duration-200 hover:border-purple-300"
        />
      </div>

      {/* Cost Center Code */}
      <div>
        <label className="block text-gray-600 mb-1 font-medium">CC Code*</label>
        <input
          type="number"
          name="CC_Code"
          value={formData.CC_Code}
          onChange={handleChange}
          placeholder="Enter CC Code"
          className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-purple-300 outline-none transition duration-200 hover:border-purple-300"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={handleClose}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 hover:text-white transition duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2 bg-dark-purple text-white rounded-lg hover:bg-purple-900 transition duration-200 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </div>
    </form>

    {/* Optional: Close button on top-right */}
    <button
      onClick={handleClose}
      className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition duration-200"
    >
      ✕
    </button>
  </div>
</div>

    );
};

export default CreateCCModal;
