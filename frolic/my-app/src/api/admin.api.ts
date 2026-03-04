import { apiAdmin } from "@/constants/api";
import type { GetAllUsersResponse } from "@/types/auth";

export const getAllUsers = async (): Promise<GetAllUsersResponse> => {
  const res = await apiAdmin.get<GetAllUsersResponse>("/getallusers");
  return res.data;
};

export const getAllCoordinators = async () => {
  const res = await apiAdmin.get<GetAllUsersResponse>("/getallusers");
  return res.data;
};

export const getInstitutes = async () => {
  const res = await apiAdmin.get("/getinstitutes");
  return res.data;
};

export interface AddInstitutePayload {
  instituteName: string;
  instituteDescription?: string;
  instituteCoOrdinatorId?: string;
}

export const addInstitute = async (payload: AddInstitutePayload) => {
  const res = await apiAdmin.post("/addinstitute", payload);
  return res.data;
};

export const updateUserRole = async (userid: string, isCordinator: boolean, coordinatorType?: string | null) => {
  const res = await apiAdmin.patch(`/updateUserRole/${userid}`, { isCordinator, coordinatorType });
  return res.data;
};

export const updateInstituteCoordinator = async (instituteid: string, instituteCoOrdinatorId: string | null) => {
  const res = await apiAdmin.patch(`/updateInstituteCoordinator/${instituteid}`, { instituteCoOrdinatorId });
  return res.data;
};

export const getDepartments = async () => {
  const res = await apiAdmin.get("/getdepartments");
  return res.data;
};

export interface AddDepartmentPayload {
  departmentName: string;
  departmentDescription?: string;
  instituteId: string;
  departmentCoOrdinatorId?: string;
}

export const addDepartment = async (payload: AddDepartmentPayload) => {
  const res = await apiAdmin.post("/adddepartment", payload);
  return res.data;
};

export const updateDepartmentCoordinator = async (departmentid: string, departmentCoOrdinatorId: string | null) => {
  const res = await apiAdmin.patch(`/updateDepartmentCoordinator/${departmentid}`, { departmentCoOrdinatorId });
  return res.data;
};

export const logoutUser = async () => {
  const res = await apiAdmin.post("/logout");
  return res.data;
};


