import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  List,
  IconButton,
  Tooltip,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Typography,
  useMediaQuery,
  CircularProgress,
  TextField,
  InputAdornment
} from "@mui/material";
import Search from "@mui/icons-material/Search";
import SearchIcon from '@mui/icons-material/Search';
import axios from "axios";
import { toast } from "react-toastify";
import SkeletonProjects from "../components/skeletonLoaders/skeletonUnAllocatedProjects";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import EmployeeDropdown from "../components/EmployeeDropdown";

const base_URL = import.meta.env.VITE_BASE_URL;

const AssignCC = () => {
  const [checked, setChecked] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingUnAllocated, setLoadingUnAllocated] = useState(false);
  const [loadingAllocated, setLoadingAllocated] = useState(false);
  const [cCList, setCCList] = useState([]);
  const [allocatedList, setAllocatedList] = useState([]);
  const [initialAllocatedList, setInitialAllocatedList] = useState([]);
  const [movingDirection, setMovingDirection] = useState(null);
  const [selectedFrom, setSelectedFrom] = useState(null); 
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTextLeft, setSearchTextLeft] = useState("");
  const [searchTextRight, setSearchTextRight] = useState("");

  const navigate = useNavigate();

  // const empCode = localStorage.getItem("ECN");
  
  const Token = localStorage.getItem("authToken");

  const isMobile = useMediaQuery("(max-width: 640px)"); // Detect small screens

  const handleToggle = (value, listType) => {
    if (selectedFrom && selectedFrom !== listType) return; // Prevent selecting from the other list

    setSelectedFrom(listType); // Lock selection to one list

    const currentIndex = checked.findIndex((item) => item.id === value.id);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);


    if (newChecked.length === 0) {
      setSelectedFrom(null);
    } else {
      setSelectedFrom(listType); // Lock selection to the active list
    }
  };

  const fetchUnAllocatedCostCenters = async (empCode) => {

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
      setLoadingUnAllocated(true);
      const response = await axios.get(`${base_URL}/api/RHCCAssign/NotAllocated/List/CC?empCode=${empCode}`,
        {
          headers: {
            'Authorization': `Bearer ${Token}`
          }
        }
      );

      const formattedData = response.data.data.map((cc) => ({
        id: cc.CC_Code,
        DeptName: cc.DeptName,
        DepartmentType: cc.DepartmentType,
      }));

      setCCList(formattedData);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoadingUnAllocated(false);
    }
  };

  const fetchAllocatedCostCenters = async (empCode) => {
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
      setLoadingAllocated(true);
      const response = await axios.get(`${base_URL}/api/RHCCAssign/Allocated/List/CC?empCode=${empCode}`,
        {
          headers: {
            'Authorization': `Bearer ${Token}`
          }
        }
      );

      // console.log("res2", response);

      const formattedData = response.data.data.map((cc) => ({
        id: cc.CC_Code,
        DeptName: cc.DeptName,
        DepartmentType: cc.DepartmentType,
      }));

      // console.log({ formattedData });

      setAllocatedList(formattedData);
      setInitialAllocatedList(formattedData);
    }
    catch (error) {
      console.error("Error fetching projects:", error);
    }
    finally {
      setLoadingAllocated(false);
    }
  };

  const moveItems = (source, destination, setSource, setDestination) => {
    const newDestination = [...destination, ...checked];
    const newSource = source.filter((item) => !checked.some((c) => c.id === item.id));

    setSource(newSource);
    setDestination(newDestination);
    setChecked([]);
    setSelectedFrom(null); // Reset selection lock after moving
  };

  const handleSearch = async () => {
    if (Token) {
      const decoded = jwtDecode(Token);
      const isExpired = decoded.exp * 1000 < Date.now();
      if (isExpired) {
        toast.error("Session expired. Please login again.");
        localStorage.clear();
        navigate('/');
      }
    }

    if (!selectedEmployee) alert("Please select Reporting head");
    setLoading(true);

    try {
      fetchUnAllocatedCostCenters(selectedEmployee.ECN);
      fetchAllocatedCostCenters(selectedEmployee.ECN);
    }
    catch (error) {
      console.error("Error Fetching Cost centers:", error);
    }
    finally {
      setLoading(false);
    }
  };

  const handleSubmitClick = async () => {
    if (Token) {
      const decoded = jwtDecode(Token);
      const isExpired = decoded.exp * 1000 < Date.now();
      if (isExpired) {
        toast.error("Session expired. Please login again.");
        localStorage.clear();
        navigate('/');
      }
    }

    if (_.isEqual(allocatedList, initialAllocatedList)) {
      toast.warning("No changes detected.");
      return;
    }

    if (!selectedEmployee) {
      toast.warning("Please select and Employee from the dropdown");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${base_URL}/api/RHCCAssign/Assign/CC`,
        {
          empCode: selectedEmployee.ECN,
          ccList: allocatedList.map((item) => ({ cC_Code: item.id })),
        },
        {
          headers: {
            'Authorization': `Bearer ${Token}`
          }
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Saved successfully!");
        fetchUnAllocatedCostCenters();
        fetchAllocatedCostCenters();
        setChecked([]); // Refresh project lists after submission
      } else {
        throw new Error(`Unexpected response: ${response.status}`);
      }
    }
    catch (error) {
      console.error("Error submitting CC assignments:", error);

      if (error) {
        toast.error("Error: Bad request");
      } 
      else if (error.request) {
        // Request was made, but no response received (network issue)
        toast.error("Network error! Please check your connection.");
      }
      else {
        // Something else happened
        toast.error("An unexpected error occurred.");
      }
    }
    finally {
      setLoading(false);
    }
  };

  const filteredCostCentersLeft = cCList.filter((row) => {
    const search = searchTextLeft.toLowerCase();

    return (
      row.id?.toString().toLowerCase().includes(search) ||
      row.DeptName?.toLowerCase().includes(search) ||
      row.DepartmentType?.toLowerCase().includes(search)
    );
  });

  const filteredCostCentersRight = allocatedList.filter((row) => {
    const search = searchTextRight.toLowerCase();

    return (
      row.id?.toString().toLowerCase().includes(search) ||
      row.DeptName?.toLowerCase().includes(search) ||
      row.DepartmentType?.toLowerCase().includes(search)
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

    const fetchCostCenters = async () => {
      try {
        const response = await axios.get(`${base_URL}/api/CCMaster/List/CC`,
          {
            headers: { 'Authorization': `Bearer ${Token}` }
          }
        );
        const formattedData = response.data.data.map((cc) => ({
          id: cc.CC_Code,
          DeptName: cc.DeptName,
          DepartmentType: cc.DepartmentType,
          isActive: cc.IsActive
        }));

        setCCList(formattedData);
      }
      catch (error) {
        console.error("Error fetching Cost Centers :", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCostCenters();
  }, []);

  return (
    <div className="relative">
      {/* CircularProgress overlay when loading */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <CircularProgress color="primary" />
        </div>
      )}

      <div className="flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4 mt-4">
        <div className="flex justify-end">
          <EmployeeDropdown selectedEmployee={selectedEmployee} setSelectedEmployee={setSelectedEmployee} />
          {/* Search Button */}
          <IconButton>
            <Tooltip title="Search">
              <SearchIcon onClick={handleSearch} />
            </Tooltip>
          </IconButton>
        </div>
        <br />

        <Card className="w-full max-w-5xl bg-white shadow-xl rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mt-2">
            <Box className="flex flex-col w-full sm:w-1/3 h-[280px]" sx={{ maxWidth: '350px' }}>
              <div className="flex items-center justify-between mb-2">
                <TextField
                  fullWidth
                  size="small"
                  placeholder="ALl Cost Centers"
                  value={searchTextLeft}
                  onChange={(e) => setSearchTextLeft(e.target.value)}
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
                    "& .MuiInputBase-input": {
                      fontSize: "0.75rem",
                      padding: "6px 8px",
                    },
                  }}
                />
              </div>


              <List className="border border-gray-200 rounded-xl p-2 bg-white shadow-inner h-full overflow-y-auto text-xs">
                {loadingUnAllocated ? (
                  <SkeletonProjects />
                )
                  :
                  filteredCostCentersLeft.length === 0 ? (
                    <div className="flex justify-center items-center h-full text-gray-500 text-sm">
                      No Cost Centers available
                    </div>
                  )
                    :
                    (
                      filteredCostCentersLeft.map((item) => (
                        <ListItem
                          key={item.id}
                          onClick={() => handleToggle(item, "unallocated")}
                          className={`text-dark-purple cursor-pointer hover:bg-indigo-50 transition-all rounded-md px-2 py-1 border-b border-gray-300 last:border-b-0 ${selectedFrom && selectedFrom !== "unallocated" ? "pointer-events-none opacity-50" : ""}`}
                          sx={{ padding: "0px" }} // Reduce height and padding
                        >
                          <ListItemIcon className="min-w-[30px]">
                            <Checkbox
                              checked={checked.some((c) => c.id === item.id)}
                              size="small"
                              sx={{ transform: "scale(0.7)" }}
                              disabled={selectedFrom && selectedFrom !== "unallocated"}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="caption" sx={{ fontSize: "0.7rem" }}> {/* Smaller text */}
                                {item.DeptName} ({item.id})
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))
                    )}
              </List>

            </Box>

            {/* Move Buttons */}
            <div className={`flex ${isMobile ? "flex-row" : "flex-col"} items-center gap-2 m-4`}>
              <Button
                variant="contained"
                onClick={() => moveItems(cCList, allocatedList, setCCList, setAllocatedList, "assign")}
                disabled={checked.length === 0 || !checked.some((item) => cCList.some((p) => p.id === item.id)) || movingDirection === "unassign"}
                sx={{
                  backgroundColor: movingDirection === "unassign" ? "gray" : "#081A51",
                  color: "white",
                }}
              >
                {isMobile ? "↓" : "→"}
              </Button>

              <Button
                variant="contained"
                onClick={() => moveItems(allocatedList, cCList, setAllocatedList, setCCList, "unassign")}
                disabled={checked.length === 0 || !checked.some((item) => allocatedList.some((p) => p.id === item.id)) || movingDirection === "assign"}
                sx={{
                  backgroundColor: movingDirection === "assign" ? "gray" : "#081A51",
                  color: "white",
                }}
              >
                {isMobile ? "↑" : "←"}
              </Button>
            </div>

            {/* Allocated CCs */}
            <Box className="flex flex-col w-full sm:w-1/3 h-[280px]" sx={{ maxWidth: '350px' }}>
              <div className="flex items-center justify-between mb-2">
                <TextField
                  fullWidth
                  size="small"
                  placeholder="My Cost Centers"
                  value={searchTextRight}
                  onChange={(e) => setSearchTextRight(e.target.value)}
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
                    "& .MuiInputBase-input": {
                      fontSize: "0.75rem",
                      padding: "6px 8px",
                    },
                  }}
                />
              </div>

              <List className="border border-gray-200 rounded-xl p-2 bg-white shadow-inner h-full overflow-y-auto text-xs">
                {loadingAllocated ? (
                  <SkeletonProjects /> // Use the skeleton component
                ) : filteredCostCentersRight.length === 0 ? (
                  <div className="flex justify-center items-center h-full text-gray-500 text-sm">
                    No allocated Cost Centers
                  </div>
                ) : (
                  filteredCostCentersRight.map((item) => (
                    <ListItem
                      key={item.id}
                      onClick={() => handleToggle(item, "allocated")}
                      className={`cursor-pointer hover:bg-indigo-50 transition-all rounded-md border-b border-gray-300 last:border-b-0 ${selectedFrom && selectedFrom !== "allocated" ? "pointer-events-none opacity-50" : ""}`}
                      sx={{ padding: "0px" }}
                    >
                      <ListItemIcon>
                        <Checkbox
                          checked={checked.some((c) => c.id === item.id)}
                          size="small"
                          sx={{ transform: "scale(0.7)" }}
                          disabled={selectedFrom && selectedFrom !== "allocated"}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="caption" sx={{ fontSize: "0.7rem" }}>
                            {item.DeptName} ({item.id})
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))
                )}
              </List>
            </Box>
          </div>

          <div className="flex justify-end mt-4">
            <Button
              variant="outlined"
              onClick={handleSubmitClick}
              className="ml-auto border-dark-purple text-dark-purple hover:bg-dark-purple hover:text-white font-sm px-3 py-1 rounded-md"
              sx={{
                borderColor: "#081A51", // Dark purple border
                color: "#081A51", // Dark purple text
                "&:hover": {
                  backgroundColor: "#081A51", // Dark purple background on hover
                  color: "white", // White text on hover
                },
              }}
            >
              Submit
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AssignCC;