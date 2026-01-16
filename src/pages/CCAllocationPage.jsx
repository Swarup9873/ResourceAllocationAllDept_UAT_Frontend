import { useState, useEffect } from "react";
import { Typography, CircularProgress, Tooltip, IconButton, Popover, Button } from "@mui/material";
import DataGridProjectAllocation from "../components/datagrids/ReactTable"
import ReactTableCCAllocation from "../components/datagrids/ReactTableCCAllocation";
import SearchIcon from '@mui/icons-material/Search';
import axios from "axios";
import { toast } from "react-toastify";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import DownloadIcon from "@mui/icons-material/Download";
import EmployeeDropdown from "../components/EmployeeDropdown";


const base_URL = import.meta.env.VITE_BASE_URL;

const CCAllocationPage = () => {

    const [loading, setLoading] = useState(false);
    const [loadingTable, setLoadingTable] = useState(false);
    const [rows, setRows] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [columns, setColumns] = useState([]);
    const [payload, setPayload] = useState([]);
    const [isHidden, setIsHidden] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);
    const [dmonth, setDmonth] = useState(null);
    const [dept, setDept] = useState(null);
    const [count, setCount] = useState(0);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const open = Boolean(anchorEl);
    const id = open ? 'submit-popover' : undefined;
    const navigate = useNavigate();

    const Token = localStorage.getItem("authToken");
    const empCode = localStorage.getItem("ECN");
    const user = localStorage.getItem('username');

    const m_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const d = new Date();
    const currentMonth = m_names[d.getMonth()];

    let curr_year = d.getFullYear();

    const [formData, setFormData] = useState({
        month: currentMonth,
        year: curr_year,
    });

    const months = [
        "January", "February", "March", 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const years = Array.from({ length: 5 }, (_, i) => 2023 + i); // Generates years from 2020 to 2030

    const handleChange = (e) => {
        const { name, value, options, selectedIndex } = e.target;

        const updatedData = {
            ...formData,
            [name]: value,
        };

        if (name === "departmentId") {
            updatedData.departmentName = options[selectedIndex].text;
        }

        setFormData(updatedData);
    };

    const handleSubmitClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    function transformData(data) {
        let result = [];

        data.forEach(entry => {
            const { EmpCode, EmpName, ...projects } = entry;

            console.log({entry});
            

            Object.entries(projects).forEach(([project, allocation]) => {

                const parts = project.split("##");

                if (parts.length === 2) {
                    const projectName = parts[0];  // Name before ##
                    const CC_Code = parts[1];    // Number after ##

                    if (allocation !== null && allocation !== "0" && allocation !== 0) {
                        result.push({
                            allocationRate: allocation.toString(), // Default allocation to 0 if null
                            empCode: EmpCode,
                            empName: EmpName,
                            cC_Code: CC_Code,  // Add extracted ProjectId
                        });
                    }
                }
            });
        });

        return result;
    }

    const handleSave = async (e) => {
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

        // Transform updated rows into payload format
        const updatedPayload = transformData(rows);
        
        setPayload(updatedPayload);

        try {
            const response = await axios.post(`${base_URL}/api/CCAllocation/Allocate/CC`,
                {
                    "empCode": (selectedEmployee.ECN).toString(),
                    "allocationMonth": formData.month,
                    "allocationYear": formData.year,
                    "isSubmitted": false,
                    "allocationDetails": updatedPayload
                },
                {
                    headers: {
                        'Authorization': `Bearer ${Token}`
                    }
                });


            if (response.status === 201 && response.data?.isSuccess) {
                toast.success(response.data?.returnMessage || "Data saved successfully!");
                fetchProjectAllocation();
            }
            else {
                throw new Error(response.data?.returnMessage || "Server returned an unexpected response.");
            }
        }
        catch (error) {
            console.error("Error saving data:", error);
            if (error.response) {
                const errorMessage = error.response.data?.returnMessage || "Failed to submit data due to a server error.";
                toast.error(errorMessage);
            } else if (error.request) {
                // Request was made but no response received (Network issue)
                toast.error("No response from the server. Please check your internet connection.");
            } else {
                // Something else went wrong
                toast.error("An unexpected error occurred. Please try again.");
            }
        }
        finally {
            setLoading(false);
        }
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
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

        // Transform updated rows into payload format
        const updatedPayload = transformData(rows);
        //console.log({updatedPayload});

        setPayload(updatedPayload);


        try {
            const response = await axios.post(`${base_URL}/api/CCAllocation/Allocate/CC`,
                {
                    "empCode": (selectedEmployee.ECN).toString(),
                    "allocationMonth": formData.month,
                    "allocationYear": formData.year,
                    "isSubmitted": true,
                    "allocationDetails": updatedPayload
                },
                {
                    headers: {
                        'Authorization': `Bearer ${Token}`
                    }
                }
            );


            if (response.status === 201 && response.data?.isSuccess) {
                setIsSubmitted(true);
                toast.success(response.data?.returnMessage || "Data Submitted successfully!");
                fetchProjectAllocation();

            } else {
                throw new Error(response.data?.returnMessage || "Server returned an unexpected response.");
            }
        }
        catch (error) {
            console.error("Error Submitting data:", error);
            if (error.response) {
                const errorMessage = error.response.data?.returnMessage || "Failed to submit data due to a server error.";
                toast.error(errorMessage);
            } else if (error.request) {
                // Request was made but no response received (Network issue)
                toast.error("No response from the server. Please check your internet connection.");
            } else {
                // Something else went wrong
                toast.error("An unexpected error occurred. Please try again.");
            }
        }
        finally {
            setLoading(false);
        }
    };

    const handleClone = async (e) => {
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


        let month_index = d.getMonth() - 1;
        let year = curr_year;

        if (month_index < 0) {
            month_index = 11;
            year -= 1;
        }
        const month = m_names[month_index];

        try {
            setLoadingTable(true);

            const response = await axios.get(`${base_URL}/api/CCAllocation/Details/CC?EmpCode=${selectedEmployee.ECN}&Month=${month}&Year=${year}`
                ,
                {
                    headers: {
                        'Authorization': `Bearer ${Token}`
                    }
                }
            );

            //console.log(response.data);

            // const { isSuccess, returnMessage, data } = response.data;
            const isSuccess = response.data.isSuccess;
            const returnMessage = response.data.returnMessage;
            const data = response.data.data.list;

            // setIsSubmitted(response.data.data.isSubmitted);

            if (!isSuccess) {
                toast.error(`Error: ${returnMessage}`);
                return;
            }

            if (data.length === 0) {
                toast.warn("No project allocation data found for the previous month.");
                return;
            }

            // Generate columns dynamically based on the keys of the first object
            const firstItem = data[0];
            const nonEditableColumns = ["EmpCode", "TOTAL", "EmpName", "Reporting Head", "MaxAllocation"];

            const dynamicColumns = Object.keys(firstItem).map((key) => ({
                field: key,
                headerName: key.split("##")[0].replace(/_/g, " ").toUpperCase(),
                minWidth: Math.max(120, key.length * 12),
                flex: 1,
                editable: !nonEditableColumns.includes(key),
                filterable: false,
                renderCell: (params) => (
                    <div style={{ whiteSpace: "normal", wordWrap: "break-word", overflowWrap: "break-word" }}>
                        {params.value}
                    </div>
                ),
            }));

            dynamicColumns.push({
                field: "Total",
                headerName: "TOTAL",
                width: 200,
                hideable: false, // Ensures it stays visible in the UI
                disableExport: true, // Prevents it from being exported
                renderCell: (params) => (
                    <div
                        style={{
                            backgroundColor: params.value !== 100 ? "rgba(255, 99, 71, 0.3)" : "rgba(144, 238, 144, 0.5)",
                            color: params.value !== 100 ? "red" : "green",
                            fontWeight: "bold",
                        }}
                    >
                        {params.value}
                    </div>
                ),
            });

            const transformedRows = data.map((item, index) => {
                let rowTotal = 0;
                const newItem = { id: index + 1 };

                Object.keys(item).forEach((key) => {
                    let value = item[key];

                    // If value is null, set it to "0"
                    if (value === null || value === undefined) {
                        value = "0";
                    }

                    newItem[key] = value; // Store the updated value

                    // Convert value to number if it's not in nonEditableColumns
                    if (!nonEditableColumns.includes(key)) {
                        const numValue = parseFloat(value);
                        if (!isNaN(numValue)) {
                            rowTotal += numValue;
                        }
                    }
                });

                newItem["Total"] = rowTotal; // Add computed total for each row
                return newItem;
            });

            setColumns(dynamicColumns);
            setRows(transformedRows);
        }
        catch (error) {
            console.error("Error fetching projects:", error);
            toast.error("Failed to fetch project allocation data." + error.message);
        }
        finally {
            setFormData({
                month: currentMonth,
                year: curr_year
            })
            setLoadingTable(false);
        }
    };

    const handleSearch = async (e) => {
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

        try {
            setLoadingTable(true);

            const response = await axios.get(`${base_URL}/api/CCAllocation/Details/CC?EmpCode=${selectedEmployee.ECN}&Month=${formData.month}&Year=${formData.year}`
                ,
                {
                    headers: {
                        'Authorization': `Bearer ${Token}`
                    }
                }
            );

            //const { isSuccess, returnMessage, data } = response.data;

            const isSuccess = response.data.isSuccess;
            const returnMessage = response.data.returnMessage;
            const data = response.data.data.list;

            setIsSubmitted(response.data.data.isSubmitted);


            if (!isSuccess) {
                toast.error(`Error: ${returnMessage}`);
                return;
            }

            if (data.length === 0) {
                toast.warn("No project allocation data found for the selected month and year.");
                return;
            }

            setDmonth(formData.month);
            setDept(formData.departmentName);

            // Generate columns dynamically based on the keys of the first object
            const firstItem = data[0];

            const nonEditableColumns = ["EmpCode", "TOTAL", "EmpName", "Reporting Head", "MaxAllocation", "CC_Code"];

            const dynamicColumns = Object.keys(firstItem).map((key) => ({
                field: key,
                headerName: key.split("##")[0].replace(/_/g, " ").toUpperCase(),
                minWidth: Math.max(120, key.length * 12),
                flex: 1,
                editable: !nonEditableColumns.includes(key),
                filterable: false,
                renderCell: (params) => (
                    <div style={{ whiteSpace: "normal", wordWrap: "break-wrap", overflowWrap: "break-word" }}>
                        {params.value}
                    </div>
                ),
            }));

            dynamicColumns.push({
                field: "Total",
                headerName: "TOTAL",
                width: 200,
                hideable: false, // Ensures it stays visible in the UI
                disableExport: true, // Prevents it from being exported
                renderCell: (params) => (
                    <div
                        style={{
                            backgroundColor: params.value !== 100 ? "rgba(255, 99, 71, 0.3)" : "rgba(144, 238, 144, 0.5)",
                            color: params.value !== 100 ? "red" : "green",
                            fontWeight: "bold",
                        }}
                    >
                        {params.value}
                    </div>
                ),
            });

            const transformedRows = data.map((item, index) => {
                let rowTotal = 0;
                const newItem = { id: index + 1 };

                Object.keys(item).forEach((key) => {
                    let value = item[key];

                    // If value is null, set it to "0"
                    if (value === null || value === undefined) {
                        value = "0";
                    }

                    newItem[key] = value; // Store the updated value

                    // Convert value to number if it's not in nonEditableColumns
                    if (!nonEditableColumns.includes(key)) {
                        const numValue = parseFloat(value);
                        if (!isNaN(numValue)) {
                            rowTotal += numValue;
                        }
                    }
                });

                newItem["Total"] = rowTotal; // Add computed total for each row
                return newItem;
            });

            setColumns(dynamicColumns);
            setRows(transformedRows);
        }
        catch (error) {
            console.error("Error fetching project project allocation:", error);
            toast.error("Error fetching project allocation :" + error.message);
        }
        finally {
            setLoadingTable(false);

            if (currentMonth !== formData.month || curr_year !== formData.year) {
                setIsHidden(true);
            }
            else {
                setIsHidden(false);
            }
        }
    };

    const handleDownloadExcel = () => {
        try {
            if (!rows || rows.length === 0) {
                toast.error("No data available to export");
                return;
            }

            // 1. Extract column headers in the same order as shown in the table
            const columnHeaders = columns.map(col => col.headerName || col.field);

            // 2. Create export data by mapping each row to match column order
            const exportData = rows.map(row => {
                const formattedRow = {};
                columns.forEach(col => {
                    const field = col.field;
                    const header = col.headerName || field;
                    formattedRow[header] = row[field] ?? "";
                });
                return formattedRow;
            });

            // 3. Create worksheet
            const worksheet = XLSX.utils.json_to_sheet(exportData);

            // 4. Auto adjust column widths based on content length
            const columnWidths = columnHeaders.map(header => ({
                wch: Math.max(
                    header.length,
                    ...exportData.map(r => String(r[header] || "").length)
                ) + 2,
            }));
            worksheet["!cols"] = columnWidths;

            // 5. Style header row
            // const range = XLSX.utils.decode_range(worksheet["!ref"]);
            // for (let C = range.s.c; C <= range.e.c; ++C) {
            //   const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
            //   const cell = worksheet[cellAddress];
            //   if (cell) {
            //     cell.s = {
            //       font: { bold: true },
            //       fill: { fgColor: { rgb: "D9D9D9" } },
            //       alignment: { horizontal: "center", vertical: "center" },
            //     };
            //   }
            // }


            const range = XLSX.utils.decode_range(worksheet["!ref"]);
            for (let R = range.s.r; R <= range.e.r; ++R) {
                for (let C = range.s.c; C <= range.e.c; ++C) {
                    const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
                    const cell = worksheet[cellAddress];
                    if (!cell) continue;

                    // Border style
                    const borderStyle = {
                        top: { style: "thin", color: { rgb: "999999" } },
                        bottom: { style: "thin", color: { rgb: "999999" } },
                        left: { style: "thin", color: { rgb: "999999" } },
                        right: { style: "thin", color: { rgb: "999999" } },
                    };

                    // Header Row Styling
                    if (R === 0) {
                        cell.s = {
                            font: { bold: true, color: { rgb: "000000" } },
                            fill: { fgColor: { rgb: "D9D9D9" } },
                            alignment: { horizontal: "center", vertical: "center" },
                            border: borderStyle,
                        };
                    } else {
                        // Alternating Row Colors
                        const isEvenRow = R % 2 === 0;
                        cell.s = {
                            fill: {
                                fgColor: { rgb: isEvenRow ? "FFFFFF" : "F3F3F3" },
                            },
                            alignment: { horizontal: "left", vertical: "center" },
                            border: borderStyle,
                        };
                    }
                }
            }

            // Freeze Header Row and First 3 Columns
            worksheet["!freeze"] = { xSplit: 3, ySplit: 1, topLeftCell: "D2" };

            // 6. Create workbook and append the sheet
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "ProjectAllocation");

            // 7. Write buffer and save
            const excelBuffer = XLSX.write(workbook, {
                bookType: "xlsx",
                type: "array",
                cellStyles: true,
            });

            const data = new Blob([excelBuffer], {
                type: "application/octet-stream",
            });

            saveAs(data, `Project_Allocation_${user}_${dmonth}.xlsx`);
        } catch (error) {
            console.error("Error exporting Excel:", error);
        }
    };

    const handleCellEditCommit = (params) => {
        setRows(prevRows => {
            const updatedRows = prevRows.map(row =>
                row.id === params.id ? { ...row, [params.field]: params.value } : row
            );

            //console.log("Updated Rows:", updatedRows); // Debugging
            return [...updatedRows]; // Spread to ensure a new reference
        });
    };

    const validateRows = () => {
        const hasInvalidRows = rows.some(row => {
            console.log({ row });
            return row.Total !== row; // Check if Total is NOT equal to 100
        });

        // const hasInvalidRows = rows.some(row => {
        //   console.log(row);
        //   return row.Total !== row.MaxAllocation; // Check if Total is NOT equal to 100
        // });

        setIsDisabled(hasInvalidRows); // Disable button if invalid rows exist
    };

    const fetchProjectAllocation = async () => {

        if (Token) {
            const decoded = jwtDecode(Token);
            const isExpired = decoded.exp * 1000 < Date.now();
            if (isExpired) {
                toast.error("Session expired. Please login again.");
                localStorage.clear();
                navigate('/');
            }
        }

        try {
            setLoadingTable(true);
            const response = await axios.get(`${base_URL}/api/CCAllocation/Details/CC?EmpCode=${selectedEmployee.ECN}&Month=${currentMonth}&Year=${curr_year}`
                ,
                {
                    headers: {
                        'Authorization': `Bearer ${Token}`
                    }
                }
            );
            const data = response.data.data.list;

            setIsSubmitted(response.data.data.isSubmitted);

            console.log({ data });

            if (data.length > 0) {
                // Generate columns dynamically based on the keys of the first object
                const firstItem = data[0];
                console.log({ firstItem });

                const nonEditableColumns = ["EmpCode", "TOTAL", "EmpName", "Reporting Head", "CC_Code"];

                const dynamicColumns = Object.keys(firstItem).map((key) => ({
                    field: key,
                    headerName: key.split('##')[0].replace(/_/g, ' ').toUpperCase(), // Format header names
                    minWidth: 130,
                    flex: 1,
                    editable: !nonEditableColumns.includes(key),
                    filterable: false,
                    renderCell: (params) => (
                        <div style={{ whiteSpace: "normal", wordWrap: "break-word", overflowWrap: "break-word" }}>
                            {params.value}
                        </div>
                    ),
                }));

                dynamicColumns.push({
                    field: "Total",
                    headerName: "TOTAL(OPEX+CAPEX)",
                    width: 200,
                    hideable: false,
                    disableExport: true, // Prevents it from being exported
                    renderCell: (params) => (

                        <div
                            style={{
                                backgroundColor: params.value !== 100 ? "rgba(255, 99, 71, 0.3)" : "rgba(144, 238, 144, 0.5)",
                                color: params.value !== 100 ? "red" : "green",
                                fontWeight: "bold",
                            }}
                        >
                            {params.value}
                        </div>
                    ),
                })

                // Transform the data into rows format with unique IDs
                const transformedRows = data.map((item, index) => {
                    let rowTotal = 0;
                    const newItem = { id: index + 1 };

                    Object.keys(item).forEach((key) => {
                        let value = item[key];

                        if (value === null || value === undefined) {
                            value = "0";
                        }

                        newItem[key] = value;

                        if (!nonEditableColumns.includes(key)) {
                            const numValue = parseFloat(value);
                            if (!isNaN(numValue)) {
                                rowTotal += numValue;
                            }
                        }
                    });

                    newItem["Total"] = rowTotal;
                    return newItem;
                });

                setCount(transformedRows.length);
                setColumns(dynamicColumns);
                setRows(transformedRows);
                setDmonth(currentMonth);
            }
        }
        catch (error) {
            console.error('Error fetching projects:', error);
        }
        finally {
            setLoadingTable(false); // Set loading to false after fetching
        }
    };

    useEffect(() => {
        if (Token) {
            const decoded = jwtDecode(Token);

            const isExpired = decoded.exp * 1000 < Date.now();
            if (isExpired) {
                toast.error("Session expired. Please login again.");
                localStorage.clear();
                navigate('/');
            }
        }

        //fetchProjectAllocation();
        setFormData({
            month: currentMonth,
            year: curr_year
        })
        setDmonth(currentMonth);
    }, []);

    useEffect(() => {
        setPayload(transformData(rows)); // Update payload automatically
        validateRows();
    }, [rows]);

    return (
        <div className="relative">
            {/* CircularProgress overlay when loading */}
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <CircularProgress color="primary" />
                </div>
            )}

            <div className="p-2 w-[90%] flex justify-end mx-auto mt-5">
                <form onSubmit={handleSearch} className="flex items-center space-x-2">
                    <EmployeeDropdown selectedEmployee={selectedEmployee} setSelectedEmployee={setSelectedEmployee} />

                    <select
                        name="month"
                        value={formData.month}
                        onChange={handleChange}
                        required
                        className="border border-gray-300 p-2 text-xs rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                    >
                        <option value="">--Month--</option>
                        {months.map((month, index) => (
                            <option key={index} value={month}>
                                {month}
                            </option>
                        ))}
                    </select>

                    <select
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        required
                        className="border border-gray-300 p-2 text-xs rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                    >
                        <option value="">--Year--</option>
                        {years.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>

                    {/* Search Button */}
                    <IconButton type="submit">
                        <Tooltip title="Search">
                            <SearchIcon />
                        </Tooltip>
                    </IconButton>
                </form>
            </div>

            {/* Project List Section */}
            <div className="p-2 w-[95%] mx-auto mt-2 text-xs">
                <div className="border border-gray-300 p-1 bg-white shadow-md rounded-lg">
                    <div className="flex justify-between bg-dark-purple">
                        <Typography variant="h6" className="text-white font-medium p-1">
                            Cost Center Allocation ({dmonth})
                        </Typography>

                        <div>
                            {!isSubmitted && !isHidden && (
                                <Tooltip title="Clone previous month data" onClick={handleClone}>
                                    <IconButton sx={{ color: "white" }}>
                                        <FileCopyIcon />
                                    </IconButton>
                                </Tooltip>
                            )}

                            <Tooltip title="Export Details in excel" onClick={handleDownloadExcel}>
                                <IconButton sx={{ color: "white" }}>
                                    <DownloadIcon />
                                </IconButton>
                            </Tooltip>
                        </div>

                    </div>

                    <div className="overflow-x-auto mt-0">
                        <ReactTableCCAllocation
                            columns={columns}
                            rows={rows}
                            setRows={setRows}
                            columnHeaderHeight={36}
                            loadingTable={loadingTable}
                            setLoadingTable={setLoadingTable}
                            handleCellEditCommit={handleCellEditCommit} // Capture edits
                            isSubmitted={isSubmitted}
                        />
                    </div>

                    <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClosePopover}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                    >
                        <div style={{ padding: '16px', maxWidth: '300px', textAlign: 'center' }}>
                            <Typography variant="body2">Are you sure you want to submit?</Typography>
                            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px' }}>
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={handleSubmit}
                                >
                                    Yes
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={handleClosePopover}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </Popover>

                    <div className="flex justify-end">

                        {!isSubmitted && !isHidden && (
                            <button
                                type="button"
                                className="cursor-pointer border border-[#081A51] text-[#081A51] font-md px-4 py-1 rounded-md m-1  hover:scale-110"
                                onClick={handleSave}
                            >
                                Save as Draft
                            </button>
                        )}

                        {!isHidden && !isSubmitted && (
                            <Tooltip title={isDisabled ? "Total of each row must be 100" : ""} disableHoverListener={!isDisabled}>
                                <button
                                    type="button"
                                    className={`border font-md px-4 py-1 rounded-md m-1 transition-transform duration-200 ${isDisabled
                                        ? "cursor-not-allowed border-gray-400 text-gray-400"
                                        : "cursor-pointer border-[#081A51] text-[#081A51] hover:scale-110"
                                        }`}
                                    // onClick={handleSubmit}
                                    onClick={handleSubmitClick}
                                    disabled={isDisabled}
                                >
                                    Submit
                                </button>
                            </Tooltip>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );

};

export default CCAllocationPage;