import axios from "axios";
import { base_URL } from "../config";

export const fetchCostCenters = async (token) => {
  const response = await axios.get(
    `${base_URL}/api/CCMaster/List/CC`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.data.map((cc) => ({
    id: cc.CC_Code,
    DeptName: cc.DeptName,
    DepartmentType: cc.DepartmentType,
    isActive: cc.IsActive,
  }));
};
