import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { LinearProgress, Typography, Box } from '@mui/material';

const DataGridCostCentersList = ({ rows, columns, loading, setLoading }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let interval;
        if (loading) {
            interval = setInterval(() => {
                setProgress((oldProgress) => {
                    if (oldProgress === 100) {
                        clearInterval(interval);
                        setLoading(false);
                        return 100;
                    }
                    return Math.min(oldProgress + 10, 100); // Increase progress by 10% every interval
                });
            }, 3000);
        }

        return () => clearInterval(interval);
    }, [loading]);

    return (
        <Box sx={{ width: '100%' }}>
            {loading && (
                <Box sx={{ width: '100%', mb: 1 }}>
                    <Typography variant="body2" sx={{ textAlign: 'center', mb: 1, color: '#081A51' }}>
                        Loading Data... {progress}%
                    </Typography>
                    <LinearProgress variant="determinate" value={progress} />
                </Box>
            )}
            
            <DataGrid
                rows={loading ? [] : rows} // Show empty rows while loading
                columns={columns}
                loading={loading}
                disableColumnSelector
                disableRowSelectionOnClick
                pageSizeOptions={[5, 10]}
                rowHeight={30}
                sx={{
                    border: 0,
                    height: '400px', // Adjust the height
                    width: 'auto',
                    '.MuiDataGrid-columnHeader': {
                        position: "sticky",
                        backgroundColor: "#EDEAEE",
                        fontSize: '0.775rem', // Make column header font smaller
                    },
                    '.MuiDataGrid-columnHeaderTitle': {
                        fontWeight: 'bold', // Ensures title text is bold
                        color:' #081A51',
                    },
                    '.MuiDataGrid-scrollbarFiller':{
                        backgroundColor: "#EDEAEE",
                    },
                    '.MuiDataGrid-filler': {
                        backgroundColor: "#EDEAEE",
                    },

                    '& .MuiDataGrid-row:nth-of-type(even)': {
                        backgroundColor: '#f7f7f7', // Light gray background for alternate rows
                    },
                    '& .MuiDataGrid-row:nth-of-type(odd)': {
                        backgroundColor: '#ffffff', // White background for normal rows
                    },
                    // '.MuiButtonBase-root.MuiIconButton-root': {
                    //     fontSize: '0.775rem', // Reduce pagination button size
                    //     padding: '4px', // Reduce padding of arrows
                    // },
                    '.MuiSvgIcon-root': {
                        fontSize: '1rem', // Reduce arrow icon size
                    }
                }}
            />
        </Box>
    );
};

export default DataGridCostCentersList;