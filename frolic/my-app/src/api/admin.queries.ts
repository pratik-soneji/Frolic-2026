import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllUsers,
  getInstitutes,
  addInstitute,
  updateUserRole,
  updateInstituteCoordinator,
  getDepartments,
  addDepartment,
  updateDepartmentCoordinator,
  logoutUser,
} from "./admin.api";
import type { AddInstitutePayload, AddDepartmentPayload } from "./admin.api";

// ── Users ─────────────────────────────────────────────────────
export const useGetAllUsers = () =>
  useQuery({ queryKey: ["admin-users"], queryFn: getAllUsers });

export const useGetAllCoordinators = () =>
  useQuery({ queryKey: ["admin-coordinators"], queryFn: getAllUsers });

// ── Institutes ────────────────────────────────────────────────
export const useGetInstitutes = () =>
  useQuery({ queryKey: ["admin-institutes"], queryFn: getInstitutes });

export const useAddInstitute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddInstitutePayload) => addInstitute(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-institutes"] }),
  });
};

export const useUpdateInstituteCoordinator = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ instituteid, instituteCoOrdinatorId }: { instituteid: string; instituteCoOrdinatorId: string | null }) =>
      updateInstituteCoordinator(instituteid, instituteCoOrdinatorId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-institutes"] }),
  });
};

// ── Departments ───────────────────────────────────────────────
export const useGetDepartments = () =>
  useQuery({ queryKey: ["admin-departments"], queryFn: getDepartments });

export const useAddDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddDepartmentPayload) => addDepartment(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-departments"] }),
  });
};

export const useUpdateDepartmentCoordinator = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ departmentid, departmentCoOrdinatorId }: { departmentid: string; departmentCoOrdinatorId: string | null }) =>
      updateDepartmentCoordinator(departmentid, departmentCoOrdinatorId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-departments"] }),
  });
};

// ── User Role Toggle ──────────────────────────────────────────
export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userid, isCordinator, coordinatorType }: { userid: string; isCordinator: boolean; coordinatorType?: string | null }) =>
      updateUserRole(userid, isCordinator, coordinatorType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-coordinators"] });
      queryClient.invalidateQueries({ queryKey: ["admin-institutes"] });
      queryClient.invalidateQueries({ queryKey: ["admin-departments"] });
    },
  });
};

export const useLogoutUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => logoutUser(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
  });
};
