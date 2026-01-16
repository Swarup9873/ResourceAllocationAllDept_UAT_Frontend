import { useEffect, useState } from "react";
import { CircularProgress, Box, Tooltip, IconButton, TextField, InputAdornment } from "@mui/material";
import Search from "@mui/icons-material/Search";
import axios from "axios";
import { toast } from "react-toastify";
import DownloadIcon from "@mui/icons-material/Download";
import * as XLSX from 'xlsx';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import RemainingResourceSubmissionModal from "../components/Modals/RemainingResourceSubmissionModal";

const base_URL = import.meta.env.VITE_BASE_URL;

const ExportExcel = () => {
    const [excelData, setExcelData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingDownload, setLoadingDownload] = useState(false);
    const [total100Count, setTotal100Count] = useState(0);
    const [lessThan100Count, setLessThan100Count] = useState(0);
    const [openModal, setOpenModal] = useState(false);
    const [lessThan100List, setLessThan100List] = useState([]);
    const [searchText, setSearchText] = useState("");
    const navigate = useNavigate();

    const empCode = localStorage.getItem("ECN");
    const Token = localStorage.getItem("authToken");

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

    const years = Array.from({ length: 5 }, (_, i) => 2024 + i); // Generates years from 2020 to 2030

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDownloadExcel = async (e) => {
        e.preventDefault();

        if (Token) {
            const decoded = jwtDecode(Token);
            const isExpired = decoded.exp * 1000 < Date.now();
            if (isExpired) {
                toast.error("Session expired. Please login again.");
                localStorage.clear();
                navigate('/');
                return;
            }
        }

        setLoadingDownload(true);

        try {
            const response = await axios.get(
                `${base_URL}/api/ProjectAllocation/Details/Download?Month=${formData.month}&Year=${formData.year}`,
                {
                    headers: {
                        'Authorization': `Bearer ${Token}`
                    }
                }
            );

            if (response.data && response.data.data) {
                const { contentType, src } = response.data.data;
                const byteCharacters = atob(src);
                const byteNumbers = Array.from(byteCharacters, c => c.charCodeAt(0));
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: contentType });


                // 👉 1. Trigger Download
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                // a.download = "Resource_Allocation_Technology.xlsx";
                a.download = `Resource_Allocation_Technology_${formData.month}_${formData.year}.xlsx`;
                document.body.appendChild(a);
                a.click();
                URL.revokeObjectURL(url);
                document.body.removeChild(a);

                toast.success("Report downloaded");
            }
            else {
                toast.error("Invalid response format");
            }
        }
        catch (error) {
            console.error("Error downloading report:", error);
            toast.error("Failed to download report." + error.message);
        }
        finally {
            setLoadingDownload(false);
        }
    };

    const handlePreviewExcel = async () => {
        // e.preventDefault();

        if (Token) {
            const decoded = jwtDecode(Token);
            const isExpired = decoded.exp * 1000 < Date.now();
            if (isExpired) {
                toast.error("Session expired. Please login again.");
                localStorage.clear();
                navigate('/');
                return;
            }
        }

        setLoading(true);

        try {
            const response = await axios.get(
                `${base_URL}/api/ProjectAllocation/Details/Download?Month=${formData.month}&Year=${formData.year}`,
                {
                    headers: {
                        'Authorization': `Bearer ${Token}`
                    }
                }
            );

            if (response.data && response.data.data) {
                const { contentType, src } = response.data.data;
                const byteCharacters = atob(src);
                const byteNumbers = Array.from(byteCharacters, c => c.charCodeAt(0));
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: contentType });


                // 2.Parse Excel using XLSX
                const arrayBuffer = await blob.arrayBuffer();
                const workbook = XLSX.read(arrayBuffer, { type: "array" });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

                const lessThan100 = jsonData.filter((row) => {
                    const value = parseFloat(row["TotalSum(Opex+Capex)"]);
                    return !isNaN(value) && value < 100;
                });

                setLessThan100List(lessThan100);
                setLessThan100Count(lessThan100.length)


                //console.log("Rows where TotalSum(Opex+Capex) < 100:", lessThan100.map((data)=> data.EmpName));

                const count100 = jsonData.filter(
                    (row) => row["TotalSum(Opex+Capex)"] === '100'
                ).length;

                // console.log({jsonData});

                setExcelData(jsonData); // set parsed data
                setTotal100Count(count100);
            }
            else {
                toast.error("Invalid response format");
            }
        }
        catch (error) {
            console.error("Error downloading or parsing report:", error);
            toast.error("Failed to load report." + error.message);
        }
        finally {
            setLoading(false);
        }
    };

    const filteredSearch = excelData.filter((row) => {
        const search = searchText.toLowerCase();

        return (
            row.EmpCode?.toString().toLowerCase().includes(search) ||
            row.EmpName?.toLowerCase().includes(search) ||
            row.ReportingHead?.toLowerCase().includes(search)
        );
    });

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

        handlePreviewExcel();
    }, []);

    return (
        <>
            <div className="w-[90%] mx-auto mt-3 flex flex-col justify-center items-center text-xs">

                {/* Search and Filter */}
                <div className="flex items-center justify-between mt-8 w-full">
                    <TextField
                        size="small"
                        placeholder="Search by Emp Code / Name / Reporitng Head"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            backgroundColor: "white",
                            borderRadius: "8px",
                            width: "265px",         // <-- default/fixed width
                            minWidth: "200px",
                            "& .MuiInputBase-input": {
                                fontSize: "0.75rem",
                                padding: "6px 8px",
                            },
                        }}
                    />

                    <form className="flex items-center space-x-2">
                        {/* Month Dropdown */}
                        <select
                            name="month"
                            value={formData.month}
                            onChange={handleChange}
                            required
                            className="border border-gray-300 px-2 py-1 text-xs rounded-md focus:ring-1 focus:ring-blue-400 focus:outline-none"
                        >
                            <option value="">Month</option>
                            {months.map((month, index) => (
                                <option key={index} value={month}>{month}</option>
                            ))}
                        </select>

                        {/* Year Dropdown */}
                        <select
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                            required
                            className="border border-gray-300 px-2 py-1 text-xs rounded-md focus:ring-1 focus:ring-blue-400 focus:outline-none"
                        >
                            <option value="">Year</option>
                            {years.map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>

                        {/* Export Button */}
                        <IconButton onClick={handlePreviewExcel} disabled={loading} size="small">
                            <Tooltip title="Preview">
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    {loading ? (
                                        <CircularProgress size={16} sx={{ mr: 1 }} />
                                    ) : (
                                        <DownloadIcon fontSize="small" />
                                    )}
                                </Box>
                            </Tooltip>
                        </IconButton>
                    </form>

                </div>

                {excelData.length > 0 && (
                    // {filteredSearch.length > 0 && (
                    <div className="mt-5 mb-14 max-w-sx w-full text-xs">

                        <div className="max-h-[400px] overflow-auto border border-gray-200 rounded-lg shadow-sm">
                            <table className="min-w-full table-auto text-[10px] text-left text-gray-700">
                                <thead className="bg-gray-200 text-gray-900 sticky top-0 z-10 text-[10px]">
                                    <tr>
                                        {Object.keys(excelData[0]).map((key, index) => (
                                            <th key={index} className="px-2 py-1 font-medium border-b">
                                                {key}
                                            </th>
                                        ))}

                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredSearch.map((row, rowIndex) => (
                                        // {excelData.map((row, rowIndex) => (
                                        <tr key={rowIndex} className="border-t">
                                            {Object.entries(row).map(([key, value], colIndex) => {
                                                const isTotalColumn = key.trim().toLowerCase() === "totalsum(opex+capex)";
                                                const numericValue = parseFloat(value);
                                                const isProjectColumn = key.trim().toLowerCase() === "totalsum(opex+capex)" || key.trim().toLowerCase() === "empcode";

                                                let bgColor = '';
                                                if (isTotalColumn) {
                                                    if (numericValue === 100) {
                                                        bgColor = 'bg-green-100 text-green-800';
                                                    } else {
                                                        bgColor = 'bg-red-100 text-red-800';
                                                    }
                                                }

                                                return (
                                                    <td
                                                        key={colIndex}
                                                        className={`px-2 py-1 border-b ${bgColor} ${!isProjectColumn &&
                                                            !isNaN(Number(value)) &&
                                                            Number(value) > 0
                                                            ? "text-red-600 "
                                                            : ""
                                                            }`}
                                                    >
                                                        {value}
                                                    </td>

                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-between mt-3">
                            <span className="text-sm text-blue-600 font-medium">
                                Total Rows: {excelData.length}, Total submitted : {total100Count} 
                                <span
                                    onClick={() => setOpenModal(true)}
                                    className="text-red-600 underline cursor-pointer hover:text-red-800"
                                >
                                    , Remaining: {lessThan100Count}
                                </span>
                            </span>

                            <button
                                type="button"
                                className="cursor-pointer border border-[#081A51] text-[#081A51] font-normal px-3 py-1 text-xs rounded-md hover:scale-105" onClick={handleDownloadExcel}
                                disabled={loadingDownload}
                            >
                                {loadingDownload ? (
                                    <>
                                        <CircularProgress size={16} className="mr-2" />
                                    </>
                                ) : (
                                    "Download"
                                )}
                            </button>

                        </div>

                    </div>
                )}

                {openModal && (
                    <RemainingResourceSubmissionModal 
                        open={openModal}
                        onClose={() => setOpenModal(false)}
                        title="Remaining Submissions"
                        data={lessThan100List} 
                    />
                )}
            </div>
        </>
    );
};

export default ExportExcel;