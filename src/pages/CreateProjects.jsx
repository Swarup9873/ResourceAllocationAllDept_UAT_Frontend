import React, { useState } from "react";

const CreateProject = () => {
  const [formData, setFormData] = useState({
    category: "",
    projectName: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <>
    <div className="p-6 border-2 border-blue-500 rounded-lg w-[90%] mx-auto mt-5">
      {/* Form Section */}
      <form onSubmit={handleSubmit} className="border p-4">
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold">Project Category:</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded mt-1"
            >
              <option value="">-- Select Category --</option>
              <option value="category2">Opex</option>
              <option value="category1">Capex</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold" >Project Name:</label>
            <input
              type="text"
              name="projectName"
              placeholder="enter project name"
              value={formData.projectName}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded mt-1"
            />
          </div>
          <div>
            <label className="block font-semibold">Start Date:</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded mt-1"
            />
          </div>
          <div>
            <label className="block font-semibold">End Date:</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded mt-1"
            />
          </div>
        </div>
        <div className="mt-4 text-right">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </div>

    <div className="p-6 border-2 border-blue-500 rounded-lg w-[90%] mx-auto mt-5">
      {/* Project List Section */}
      <div className="mt-6">
        <h2 className="font-semibold text-lg">Projects List:</h2>
        <div className="overflow-x-auto mt-2">
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Id</th>
                <th className="border p-2">Project Category</th>
                <th className="border p-2">Project Name</th>
                <th className="border p-2">Start Date</th>
                <th className="border p-2">End Date</th>
              </tr>
            </thead>
            <tbody>
              {/* Rows will be populated dynamically */}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    </>
  );
};

export default CreateProject;
