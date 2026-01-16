import { useState, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, LinearProgress } from '@mui/material';


const DataGridTemplate = ({ rows, columns, setRows, loadingTable, setLoadingTable, handleCellEditCommit }) => {

    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let interval;
        if (loadingTable) {
            interval = setInterval(() => {
                setProgress((oldProgress) => {
                    if (oldProgress === 100) {
                        clearInterval(interval);
                        setLoadingTable(false);
                        return 100;
                    }
                    return Math.min(oldProgress + 10, 100); // Increase progress by 10% every interval
                });
            }, 3000);
        }

        return () => clearInterval(interval);
    }, [loadingTable]);

    const paginationModel = { page: 0, pageSize: 25 };

    return (
        <Box sx={{ width: '100%' }}>
            {loadingTable && (
                <Box sx={{ width: '100%', mb: 1 }}>
                    <Typography variant="body2" sx={{ textAlign: 'center', mb: 1, color: '#081A51' }}>
                        Loading Data... {progress}%
                    </Typography>
                    <LinearProgress variant="determinate" value={progress} />
                </Box>
            )}

            <DataGrid
                rows={rows}
                columns={columns}
                // processRowUpdate={(newRow, oldRow) => {
                //     const nonEditableColumns = ["EmpCode", "TOTAL", "EmpName"];
                
                //     // Identify the edited field and value
                //     const editedField = Object.keys(newRow).find(
                //         (key) => newRow[key] !== oldRow[key]
                //     );
                
                //     // Check if the edited field is eligible for summation
                //     if (!nonEditableColumns.includes(editedField)) {
                //         const oldValue = parseFloat(oldRow[editedField]) || 0;
                //         const newValue = parseFloat(newRow[editedField]) || 0;
                
                //         // Adjust the total by removing old value and adding the new value
                //         newRow.Total = (oldRow.Total || 0) - oldValue + newValue;
                //     }
                
                //     setRows((prevRows) =>
                //         prevRows.map((row) => (row.id === oldRow.id ? newRow : row))
                //     );
                
                //     return newRow; // Ensure UI updates immediately
                // }}
                processRowUpdate={(newRow, oldRow) => {
                    const nonEditableColumns = ["EmpCode", "TOTAL", "EmpName"];
                  
                    // Identify the edited field
                    const editedField = Object.keys(newRow).find(
                      (key) => newRow[key] !== oldRow[key]
                    );
                  
                    // If no field is edited or it's non-editable, revert changes
                    if (!editedField || nonEditableColumns.includes(editedField)) {
                      return oldRow;
                    }
                  
                    // Ensure the value is a valid integer (strict check)
                    const newValue = newRow[editedField]?.toString().trim(); // Convert to string and trim spaces
                  
                    if (!/^\d+$/.test(newValue)) {  // Regex ensures only digits (no letters, decimals, or special chars)
                      toast.error("Only positive integers are allowed.");
                      return oldRow; // Prevent update
                    }
                  
                    const intValue = parseInt(newValue, 10);
                  
                    // Calculate the new total
                    const oldValue = parseInt(oldRow[editedField], 10) || 0;
                    newRow.Total = (oldRow.Total || 0) - oldValue + intValue;
                  
                    // Update the state
                    setRows((prevRows) =>
                      prevRows.map((row) => 
                        row.id === oldRow.id ? { ...newRow, [editedField]: intValue } : row
                      )
                    );
                  
                    return { ...newRow, [editedField]: intValue }; // Ensure UI updates correctly
                  }}
                  
                  
                onProcessRowUpdateError={(error) => console.error("Row Update Error:", error)}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10]}
                rowHeight={30}
                disableColumnFilter
                disableColumnMenu
                disableColumnSelector
                disableDensitySelector
                sx={{
                    maxWidth: '100%',
                    border: 0,
                    height: '300px',
                    width: '100%',
                    fontSize: '0.775rem',
                    '.MuiDataGrid-columnHeader': {
                        position: "sticky",
                        fontSize: '0.800rem',
                        wordWrap: 'break-wrap !important',
                        whiteSpace: 'normal !important', // Allows wrapping text instead of keeping it in one line
                        backgroundColor: "#EDEAEE",
                        textAlign: 'center', // Optional: Center aligns the text
                        display: 'block', // Ensures proper wrapping behavior
                    },
                    '.MuiDataGrid-columnHeaderTitle': {
                        fontWeight: 'bold',
                        color: '#081A51',
                        wordWrap: 'break-wrap !important',
                        whiteSpace: 'normal !important', // Allows wrapping text instead of keeping it in one line
                        textAlign: 'center', // Optional: Center aligns the text
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    },
                    '.MuiDataGrid-columnHeaderTitleContainer': {
                        fontWeight: 'bold',
                        color: '#081A51',
                        wordWrap: 'break-wrap !important',
                        whiteSpace: 'normal !important', // Allows wrapping text instead of keeping it in one line
                        textAlign: 'center', // Optional: Center aligns the text
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    },
                    '.MuiDataGrid-scrollbarFiller':{
                        backgroundColor: "#EDEAEE",
                    },
                    '.MuiDataGrid-cell': {
                        fontSize: '0.675rem',
                        textAlign: 'center',
                    },
                    '& .MuiDataGrid-row:nth-of-type(even)': {
                        backgroundColor: '#f7f7f7',
                    },
                    '& .MuiDataGrid-row:nth-of-type(odd)': {
                        backgroundColor: '#ffffff',
                    },
                    '.MuiDataGrid-footerContainer': {
                        fontSize: '0.775rem',
                    },
                    '.MuiTablePagination-root': {
                        fontSize: '0.775rem',
                    },
                    '.MuiTablePagination-selectLabel, .MuiTablePagination-input': {
                        fontSize: '0.775rem',
                    },
                    '.MuiTablePagination-displayedRows': {
                        fontSize: '0.715rem',
                    },
                    '.MuiButtonBase-root.MuiIconButton-root': {
                        fontSize: '0.775rem',
                        padding: '4px',
                    },
                    '.MuiSvgIcon-root': {
                        fontSize: '1rem',
                    }
                }}
            />

        </Box>
    )
}

export default DataGridTemplate