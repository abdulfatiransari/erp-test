import axios from "axios";
import { GET_TEST_ROLE, ADD_TEST_ROLE, MODIFY_TEST_ROLE } from "./apiUrls";
import {
  AddRoleRequest,
  AddRoleResponse,
  FetchRoleResponse,
  ModifyRoleRequest,
  ModifyRoleResponse,
  Role,
} from "@/types/role";

export async function fetchModules() {
  try {
    const res = await axios.get(GET_TEST_ROLE);
    return res.data;
  } catch (error) {
    throw new Error("Failed to fetch modules");
  }
}

export async function fetchRole(roleName: string): Promise<Role> {
  try {
    const res: FetchRoleResponse = await axios.get(GET_TEST_ROLE, {
      params: { roleName },
    });
    return res.data;
  } catch (error) {
    throw new Error("Role not found");
  }
}

export async function addRole(data: AddRoleRequest): Promise<Role> {
  try {
    const res: AddRoleResponse = await axios.post(ADD_TEST_ROLE, data);
    return res.data;
  } catch (error: string | any) {
    throw new Error(error?.response?.data?.message);
  }
}

export async function modifyRole(data: ModifyRoleRequest): Promise<Role> {
  try {
    const res: ModifyRoleResponse = await axios.put(MODIFY_TEST_ROLE, data);
    return res.data;
  } catch (error: string | any) {
    throw new Error(error?.response?.data?.message);
  }
}
