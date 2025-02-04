import React from 'react'
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';


function CustomToolbar() {
    return (
        <GridToolbarContainer
            style={{ display: "flex", justifyContent: "flex-end" }}
        >
            <GridToolbarExport
                printOptions={{ disableToolbarButton: true }}
                style={{ color: "#323232", fontWeight: "bold", fontSize: "0.95rem" }}
            />
        </GridToolbarContainer>
    );
}



const DataGridTemplate = ({
    rows,
    columns
}) => {

    const paginationModel = { page: 0, pageSize: 5 };

    return (
        <DataGrid
            rows={rows}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            rowHeight={30}
            slots={{
                toolbar: CustomToolbar,
            }}
            sx={{
                minWidth: 800,
                maxWidth: '100%', // Keeps it within the parent div
                border: 0,
                height: 'auto', // Adjust the height
                maxHeight: '280',
                width: '100%', // Make the grid take less width
                fontSize: '0.775rem', // Make text smaller
                '.MuiDataGrid-columnHeader': {
                 position: "sticky",
                    fontSize: '0.775rem', // Make column header font smaller
                },
                '.MuiDataGrid-cell': {
                    fontSize: '0.675rem', // Make cell text smaller
                },
                '& .MuiDataGrid-row:nth-of-type(even)': {
                    backgroundColor: '#f7f7f7', // Light gray background for alternate rows
                },
                '& .MuiDataGrid-row:nth-of-type(odd)': {
                    backgroundColor: '#ffffff', // White background for normal rows
                },
            }}

        />

    )
}

export default DataGridTemplate