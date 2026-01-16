import { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Box, Typography, LinearProgress } from "@mui/material";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { FilterMatchMode } from "primereact/api";


const DataGridProjectAllocation = ({ columns, rows, setRows, loadingTable, setLoadingTable, handleCellEditCommit, isSubmitted }) => {
    const [progress, setProgress] = useState(0);
    const toastRef = useRef(null);
    const [visibleRowCount, setVisibleRowCount] = useState(rows.length);

    const empCode = localStorage.getItem('ECN');


    const [filters, setFilters] = useState({});


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
                    return Math.min(oldProgress + 10, 100);
                });
            }, 2000);
        }
        return () => clearInterval(interval);
    }, [loadingTable]);

    const nonEditableColumns = ["EmpCode", "Reporting Head", "Total", "EmpName"];


    const onCellEditComplete = (event) => {
        if (isSubmitted) return;

        let { rowData, newValue, field } = event;
        //const nonEditableColumns = ["EmpCode", "TOTAL", "EmpName"];

        // Prevent editing of restricted columns
        if (nonEditableColumns.includes(field)) {
            toastRef.current.show({ severity: "warn", summary: "Warning", detail: "This field is not editable", life: 3000 });
            return;
        }

        // Ensure the value is a valid integer
        newValue = newValue?.toString().trim();
        if (!/^\d+$/.test(newValue)) {
            toastRef.current.show({ severity: "error", summary: "Invalid Input", detail: "Only positive integers are allowed", life: 3000 });
            return;
        }

        const intValue = parseInt(newValue, 10);
        const oldValue = parseInt(rowData[field], 10) || 0;

        const newTotal = (rowData.Total || 0) - oldValue + intValue;

        // Prevent exceeding 100
        if (newTotal > 100) {
            toastRef.current.show({
                severity: "warn",
                summary: "Limit Exceeded",
                detail: "Total cannot be more than 100",
                life: 3000,
            });

            // Revert to the old value
            rowData[field] = oldValue;
            return;
        }

        // Calculate new total
        rowData.Total = (rowData.Total || 0) - oldValue + intValue;
        rowData[field] = intValue; // Update the changed value

        // Update state
        setRows((prevRows) =>
            prevRows.map((row) => (row.id === rowData.id ? { ...rowData } : row))
        );
    };

    const textEditor = (options) => {
        const handleFocus = (e) => {
            e.target.select();  // Select the existing text for easy deletion
            options.editorCallback("");  // Make the cell empty
        };

        return (
            <InputText
                type="text"
                value={options.value}
                onChange={(e) => options.editorCallback(e.target.value)}
               // onFocus={handleFocus}   // Clear cell content on focus
            />
        );
    };

    useEffect(() => {
        if (columns.length > 0) {
            setFilters({
                [columns[1].field]: {
                    operator: 'AND',
                    constraints: [
                        { value: '', matchMode: FilterMatchMode.CONTAINS }
                    ]
                }
            });
        }
    }, [columns]);


    return (
        <Box sx={{ width: "100%" }}>
            <Toast ref={toastRef} />

            {loadingTable && (
                <Box sx={{ width: "100%", mb: 1 }}>
                    <Typography variant="body2" sx={{ textAlign: "center", mb: 1, color: "#081A51" }}>
                        Loading Data... {progress}%
                    </Typography>
                    {/* <ProgressBar value={progress} /> */}
                    <LinearProgress variant="determinate" value={progress} />
                </Box>
            )}

            <DataTable
                value={rows}
                filters={filters}
                onFilter={(e) => {
                    setFilters(e.filters);
                }}
                onValueChange={(filteredData) => {
                    setVisibleRowCount(filteredData.length);
                }}
                scrollable
                scrollHeight="390px"
                className="p-datatable-sm"
                style={{
                    fontSize: "0.675rem",
                    width: "100%",
                    border: "1px solid #ddd",
                }}
                //editMode="cell"
                editMode={isSubmitted ? "none" : "cell"}
                filterDisplay="row"
                paginator={empCode == 313}
                rows={empCode == 313 ? 20 : undefined}
            >
                <Column header="" frozen style={{ display: "none" }} />

                {columns.length > 0 && (
                    <Column
                        field={columns[0].field}
                        header={columns[0].headerName}
                        frozen
                        style={{
                            minWidth: "150px",
                            backgroundColor: "#f7f7f7",
                            fontWeight: "bold",
                            textAlign: "left",
                            position: "sticky",
                            left: 0,
                            top: 0,
                            zIndex: 100,
                            //borderBottom: "2px solid #081A51",
                        }}
                        headerStyle={{
                            position: "sticky",
                            top: 0,
                            backgroundColor: "#EDEAEE",
                            borderBottom: "2px solid #081A51",
                            zIndex: 101, // Keep header above everything

                        }}
                        bodyStyle={{
                            zIndex: 0,
                            overflowY: "auto",  // Allows vertical scrolling inside the column
                            maxHeight: "200px", // Adjust this to fit your table height
                        }}
                        className="font-bold"
                    />
                )}

                {columns.length > 1 && (
                    <Column
                        field={columns[1].field}
                        header={columns[1].headerName}
                        frozen
                        filter
                        sortable
                        filterPlaceholder="Search"
                        filterField={columns[1].field}
                        showFilterMenu
                        filterElement={(options) => {
                            const field = options.field;

                            const currentValue =
                                filters?.[field]?.constraints?.[0]?.value ?? '';

                            const handleInputChange = (e) => {
                                const value = e.target.value;

                                const updatedFilters = {
                                    ...filters,
                                    [field]: {
                                        operator: 'AND',
                                        constraints: [
                                            { value, matchMode: FilterMatchMode.CONTAINS }
                                        ]
                                    }
                                };

                                setFilters(updatedFilters);

                                if (typeof options.filterCallback === 'function') {
                                    try {
                                        options.filterCallback(value);
                                    } catch (error) {
                                        console.error("Filter callback error:", error);
                                    }
                                }
                            };

                            return (
                                <InputText
                                    value={currentValue}
                                    onChange={handleInputChange}
                                    className="p-column-filter"
                                    placeholder="Search"
                                />
                            );
                        }}


                        filterMenuClassName="p-column-filter-menu"
                        filterMenuStyle={{
                            zIndex: 3000,
                            pointerEvents: 'all'
                        }}
                        filterMenuPortal={true}
                        style={{
                            minWidth: "150px",
                            backgroundColor: "#f7f7f7",
                            fontWeight: "bold",
                            textAlign: "left",
                            position: "sticky",
                            left: 0,
                            top: 0,
                            zIndex: 100,
                            //borderBottom: "2px solid #081A51",
                        }}
                        headerStyle={{
                            position: "sticky",
                            top: 0,
                            backgroundColor: "#EDEAEE",
                            borderBottom: "2px solid #081A51",
                            zIndex: 101, // Keep header above everything
                            textAlign: "left" 
                        }}
                        bodyStyle={{
                            zIndex: 0,
                            overflowY: "auto",  // Allows vertical scrolling inside the column
                            maxHeight: "200px", // Adjust this to fit your table height
                        }}
                        className="font-bold"
                    />
                )}


                {columns.length > 2 && (
                    <Column
                        field={columns[2].field}
                        header={columns[2].headerName}
                        frozen
                        filter
                        filterPlaceholder="Search"
                        filterField={columns[2].field}
                        showFilterMenu
                        filterElement={(options) => {
                            const field = options.field;

                            const currentValue =
                                filters?.[field]?.constraints?.[0]?.value ?? '';

                            const handleInputChange = (e) => {
                                const value = e.target.value;

                                const updatedFilters = {
                                    ...filters,
                                    [field]: {
                                        operator: 'AND',
                                        constraints: [
                                            { value, matchMode: FilterMatchMode.CONTAINS }
                                        ]
                                    }
                                };

                                setFilters(updatedFilters);

                                if (typeof options.filterCallback === 'function') {
                                    try {
                                        options.filterCallback(value);
                                    } catch (error) {
                                        console.error("Filter callback error:", error);
                                    }
                                }
                            };

                            return (
                                <InputText
                                    value={currentValue}
                                    onChange={handleInputChange}
                                    className="p-column-filter"
                                    placeholder="Search"
                                />
                            );
                        }}


                        filterMenuClassName="p-column-filter-menu"
                        filterMenuStyle={{
                            zIndex: 3000,
                            pointerEvents: 'all'
                        }}
                        filterMenuPortal={true}
                        style={{
                            minWidth: "150px",
                            backgroundColor: "#f7f7f7",
                            fontWeight: "bold",
                            textAlign: "left",
                            position: "sticky",
                            left: 0,
                            top: 0,
                            zIndex: 100,
                            //borderBottom: "2px solid #081A51",
                        }}
                        headerStyle={{
                            position: "sticky",
                            top: 0,
                            backgroundColor: "#EDEAEE",
                            borderBottom: "2px solid #081A51",
                            zIndex: 101 // Keep header above everything
                        }}
                        bodyStyle={{
                            zIndex: 0,
                            overflowY: "auto",  // Allows vertical scrolling inside the column
                            maxHeight: "200px", // Adjust this to fit your table height
                        }}
                        className="font-bold"
                    />
                )}


                {/* Other Columns */}
                {columns && columns.length > 3 ? (
                    columns
                        .slice(3)
                        .map((col, index) => (
                            <Column
                                key={index}
                                field={col.field}
                                header={col.headerName}
                                headerStyle={{
                                    fontWeight: "bold",
                                    color: "#081A51",
                                    backgroundColor: "#EDEAEE",
                                    textAlign: "center",
                                    position: "sticky",
                                    top: 0,
                                    //zIndex: 2,
                                    borderBottom: "2px solid #081A51",
                                    minHeight: "40px", // Ensure header has a visible height
                                }}
                                body={(rowData) =>
                                    col.field === "Total" ? (
                                        <div
                                            style={{
                                                backgroundColor:
                                                    rowData.Total !== 100 ? "rgba(255, 99, 71, 0.3)" : "rgba(144, 238, 144, 0.5)",
                                                color: rowData.Total !== 100 ? "red" : "green",
                                                fontWeight: "bold",
                                                padding: "5px",
                                                textAlign: "center",
                                            }}
                                        >
                                            {rowData.Total}
                                        </div>
                                    ) : (
                                        rowData[col.field]
                                    )
                                }
                                bodyStyle={{
                                    textAlign: "center",
                                    backgroundColor: index % 2 === 0 ? "#ffffff" : "#f7f7f7",
                                }}
                                editor={!isSubmitted && !nonEditableColumns.includes(col.field) ? (options) => textEditor(options) : null}
                                //editor={nonEditableColumns.includes(col.field) ? null : (options) => textEditor(options)}
                                //onCellEditComplete={onCellEditComplete}   
                                onCellEditComplete={!isSubmitted ? onCellEditComplete : undefined}
                            />
                        ))
                ) : (
                    <Typography variant="body2" sx={{ textAlign: "center", color: "#ff0000" }}>
                        ⚠️ No columns available!
                    </Typography>
                )}
            </DataTable>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                <Typography variant="body2" sx={{ fontSize: '11px', color: "#081A51" }}>
                    Showing {visibleRowCount} of {rows.length} rows
                </Typography>

                {isSubmitted && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Typography
                            style={{ fontSize: '11px', color: '#555' }}
                        >
                            You have submitted the project allocation details for this month.
                        </Typography>
                    </div>
                )}
            </div>

        </Box>
    );
};

export default DataGridProjectAllocation;
