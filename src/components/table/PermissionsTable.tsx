import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "../ui/label";
import { PermissionsTableProps } from "@/types/role";

export default function PermissionsTable({
  modules,
  selectedModules,
  selectedPermissions,
  onPermissionChange,
}: PermissionsTableProps) {
  const filteredModules = modules.filter((mod) =>
    selectedModules.includes(mod.moduleName)
  );

  if (filteredModules.length === 0) {
    return null;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Modules</TableHead>
          <TableHead>Sub Modules</TableHead>
          <TableHead>Permissions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredModules.flatMap((mod) => {
          return mod.subModules.map((sub, subIndex) => (
            <TableRow key={`${mod.moduleName}-${sub.moduleName}`}>
              {subIndex === 0 && (
                <TableCell
                  rowSpan={mod.subModules.length}
                  className="font-medium"
                >
                  {mod.moduleName}
                </TableCell>
              )}
              <TableCell>{sub.moduleName}</TableCell>
              <TableCell>
                <div className="space-y-2 flex items-center gap-2">
                  {sub.permissions.map((perm) => (
                    <div
                      key={perm.permissionId}
                      className="flex items-center gap-2"
                    >
                      <Checkbox
                        id={perm.permissionId.toString()}
                        checked={selectedPermissions.includes(
                          perm.permissionId
                        )}
                        onCheckedChange={(checked) =>
                          onPermissionChange(perm.permissionId, !!checked)
                        }
                        className="cursor-pointer"
                      />
                      <Label
                        htmlFor={perm.permissionId.toString()}
                        className="cursor-pointer font-normal text-sm"
                      >
                        {perm.actionName}
                      </Label>
                    </div>
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ));
        })}
      </TableBody>
    </Table>
  );
}
