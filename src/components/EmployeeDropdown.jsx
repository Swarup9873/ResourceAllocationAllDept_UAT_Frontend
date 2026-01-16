import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { useEffect, useState } from "react";
import axios from "axios";

const base_URL = "https://matsapi.mjunction.in"

function EmployeeDropdown({ selectedEmployee, setSelectedEmployee, reload }) {
    const [empList, setEmpList] = useState([])
    const fetchAllEmployees = async () => {
        try {
            const response = await axios.get(base_URL + "/create-mat/emp-list");
            console.log({ response });

            if (response.status === 200) {
                setEmpList(response?.data?.EmpDetails || []);
            } else {
                console.error("Failed to fetch data: ", response.statusText);
            }
        }
        catch (error) {
            console.error("Error fetching Emplist:", error);
        }
    };

    useEffect(() => {
        fetchAllEmployees();
    }, [reload]);
    
    return (
        <div className="w-full max-w-5xl mx-auto w-[300px]">
            <div className="flex items-center gap-3">
                <PersonSearchIcon className="text-dark-purple" />
                <Autocomplete
                    fullWidth
                    options={empList || []}
                    getOptionLabel={(option) =>
                        `${option.EmpName}`
                    }
                    value={selectedEmployee}
                    onChange={(e, value) => setSelectedEmployee(value)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder="Search employee by name or code…"
                            variant="outlined"
                            size="small"
                            InputProps={{
                                ...params.InputProps,
                                sx: {
                                    fontSize: "0.75rem", // smaller input text
                                    "& .MuiInputBase-input": {
                                        fontSize: "0.75rem",
                                        padding: "6px 8px", // reduce padding for compact look
                                    },
                                },
                            }}
                        />
                    )}
                    ListboxProps={{
                        sx: {
                            fontSize: "0.75rem", // smaller dropdown items
                        },
                    }}
                />
            </div>
        </div>
    )
}

export default EmployeeDropdown