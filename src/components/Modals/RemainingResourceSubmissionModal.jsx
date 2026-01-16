import { TextField, InputAdornment } from "@mui/material";
import Search from "@mui/icons-material/Search";
import { useState } from "react";

const RemainingResourceSubmissionModal = ({
    open,
    onClose,
    title = "Remaining Submissions",
    data = []
}) => {
    if (!open) return null;

    const [searchText, setSearchText] = useState("");

    // Get table headers dynamically from first row
    const headers = data.length > 0 ? Object.keys(data[0]) : [];

    const filteredSearch = data.filter((row) => {
        const search = searchText.toLowerCase();

        return (
            row.EmpCode?.toString().toLowerCase().includes(search) ||
            row.EmpName?.toLowerCase().includes(search) ||
            row.ReportingHead?.toString().toLowerCase().includes(search)
        );
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-2">
            <div
                className="bg-white rounded-lg p-4  max-h-[90vh] overflow-auto shadow-lg lg:max-w-4xl"
                style={{
                    width: "1100px",        // fixed width
                    maxWidth: "100%",    // responsive fallback
                }}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-base sm:text-md font-semibold text-gray-800">
                        {title}
                    </h2>
                    <button
                        className="text-red-500 hover:text-red-700 text-sm"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>

                <div className="flex items-center justify-between mb-4 w-full">
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
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto text-[11px] sm:text-xs text-left text-gray-700 border">
                        <thead className="bg-gray-100 sticky top-0 z-10">
                            <tr>
                                {headers.map((key, index) => (
                                    <th
                                        key={index}
                                        className="px-2 py-1 border-b font-medium whitespace-nowrap"
                                    >
                                        {key.split("##")[0]}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSearch.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {Object.values(row).map((value, colIndex) => (
                                        <td
                                            key={colIndex}
                                            className="px-2 py-1 border-b whitespace-nowrap text-[10px]"
                                        >
                                            {value}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

export default RemainingResourceSubmissionModal;
