export interface Permission {
  isAllowed: boolean;
  permissionId: number;
  parentModule: string | null;
  parentModuleName: string | null;
  isActive: boolean;
  moduleName: string;
  actionType: string;
  createdBy: string;
  createdTime: string;
  createdIPAddress: string;
  moduleID: number;
  actionTypeID: number;
  includeInMenu: boolean;
  controller: string;
  actionName: string;
}

export interface SubModule {
  moduleID: number;
  moduleName: string;
  parentModuleName: string | null;
  permissions: Permission[];
  subModules: SubModule[];
}

export interface Module {
  moduleID: number;
  moduleName: string;
  parentModuleName: string | null;
  permissions: Permission[];
  subModules: SubModule[];
}

export interface ModulesResponse {
  modules: Module[];
}

export interface PermissionsTableProps {
  modules: Module[];
  selectedModules: string[];
  selectedPermissions: number[];
  onPermissionChange: (permissionId: number, checked: boolean) => void;
}

export interface Role {
  roleID?: string;
  id?: number;
  name: string;
  permissions: Permission[];
  modules: any[];
}

export interface RolePayload {
  name: string;
  permissions: number[];
}

export interface FetchRoleResponse {
  data: Role;
  // Add other fields as needed
}

export interface AddRoleRequest {
  name: string;
}

export interface AddRoleResponse {
  data: Role;
}

export interface ModifyRoleRequest {
  name: string;
  permissions: number[];
}

export interface ModifyRoleResponse {
  data: Role;
}

export interface ModuleOption {
  label: string;
  value: string;
}

export interface PermissionChangeEvent {
  permissionID: number;
  checked: boolean;
}

export interface Option {
  id: string | number;
  label: string;
}

export interface MultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

export interface PreSelectedPermission {
  permissionId: number;
  isAllowed?: boolean;
}

export interface PreSelectedSubModule {
  permissions: PreSelectedPermission[];
}

export interface PreSelectedModule {
  moduleName: string;
  subModules: PreSelectedSubModule[];
}
