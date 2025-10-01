"use client";

import PermissionsTable from "@/components/table/PermissionsTable";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MultiSelect from "@/components/ui/multi-select";
import { addRole, fetchModules, fetchRole, modifyRole } from "@/lib/helper";
import {
  RolePayload,
  Module,
  PermissionChangeEvent,
  Role,
  PreSelectedModule,
  PreSelectedSubModule,
  PreSelectedPermission,
} from "@/types/role";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";

export default function RoleManagement() {
  const [roleName, setRoleName] = useState<string>("");
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [mode, setMode] = useState<"add" | "modify">("add");
  const [error, setError] = useState<string>("");

  const { data: modulesData, isLoading: modulesLoading } = useQuery({
    queryKey: ["modules"],
    queryFn: fetchModules,
  });

  const {
    refetch: checkRole,
    data: roleData,
    error: roleError,
    isSuccess: isRoleSuccess,
    isError: isRoleError,
    isFetching,
  } = useQuery<Role, Error>({
    queryKey: ["role", roleName],
    queryFn: () => fetchRole(roleName),
    enabled: false,
  });

  useEffect(() => {
    if (isRoleSuccess && roleData) {
      setMode("modify");

      // Extract permissionIds only where isAllowed is true from nested structure
      const permissionIds = roleData.modules.flatMap((mod: PreSelectedModule) =>
        mod.subModules.flatMap((sub: PreSelectedSubModule) =>
          sub.permissions
            .filter((perm: PreSelectedPermission) => perm.isAllowed)
            .map((perm: PreSelectedPermission) => perm.permissionId)
        )
      );
      setSelectedPermissions(permissionIds);

      const preSelected: string[] = roleData.modules
        .filter((mod: PreSelectedModule) =>
          mod.subModules.some((sub: PreSelectedSubModule) =>
            sub.permissions.some(
              (perm: PreSelectedPermission) => perm.isAllowed
            )
          )
        )
        .map((mod: PreSelectedModule) => mod.moduleName);
      setSelectedModules(preSelected);
    }
    if (isRoleError) {
      setMode("add");
      setSelectedPermissions([]);
      setSelectedModules([]);
    }
  }, [isRoleSuccess, isRoleError, roleData]);

  const addMutation = useMutation({
    mutationFn: addRole,
    onSuccess: () => {
      toast.success("Role added successfully");
      setError("");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const modifyMutation = useMutation({
    mutationFn: modifyRole,
    onSuccess: () => {
      toast.success("Role modified successfully");
      setError("");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const handleRoleBlur = () => {
    if (roleName.trim()) {
      checkRole();
    }
  };

  const handlePermissionChange = useCallback(
    (
      permissionID: PermissionChangeEvent["permissionID"],
      checked: PermissionChangeEvent["checked"]
    ) => {
      setSelectedPermissions((prev: number[]) => {
        if (checked) {
          return [...prev, permissionID];
        } else {
          return prev.filter((id) => id !== permissionID);
        }
      });
    },
    []
  );

  const handleModuleChange = useCallback((selected: string[]) => {
    setSelectedModules(selected);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!roleName.trim()) {
      setError("Role name is required");
      return;
    }

    const payload: RolePayload = {
      name: roleName,
      permissions: selectedPermissions,
    };

    setError("");
    if (mode === "add") {
      addMutation.mutate(payload);
    } else {
      modifyMutation.mutate(payload);
    }
  };

  if (modulesLoading) {
    return (
      <div className="flex justify-center items-center gap-2">
        <div className="flex justify-center items-center h-64">
          <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        Loading...
      </div>
    );
  }

  const modules =
    mode === "modify" && roleData?.modules
      ? roleData.modules
      : modulesData?.modules || [];
  const moduleOptions = modules.map((mod: Module) => mod.moduleName);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Role Management</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label
            htmlFor="roleName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Role Name:
          </Label>
          <Input
            id="roleName"
            type="text"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            onBlur={handleRoleBlur}
            required
          />
        </div>
        <div>
          <Label
            htmlFor="modules"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Select Modules:
          </Label>
          <MultiSelect
            options={moduleOptions}
            selected={selectedModules}
            onChange={handleModuleChange}
            placeholder="Select modules..."
          />
        </div>
        <PermissionsTable
          modules={modules}
          selectedModules={selectedModules}
          selectedPermissions={selectedPermissions}
          onPermissionChange={handlePermissionChange}
        />
        <Button type="submit" className="cursor-pointer">
          {mode === "add" ? "Add Role" : "Modify Role"}
        </Button>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </form>
    </div>
  );
}
