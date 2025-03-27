"use client"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { type ActionStatus, setRole } from "../actions"

export const UpdateRoleForm = ({ role, setRoleAction, userId }: {
    role: string,
    setRoleAction: (formData: FormData) => Promise<{ message: UserPublicMetadata; status?: undefined; } | { status: ActionStatus; message: unknown; }>
    userId: string
}
) => {
    return (
        <Select defaultValue={role} name="role" onValueChange={async (newRole) => {
            const formData = new FormData();
            formData.append("role", newRole);
            formData.append("id", userId);

            const response = await setRoleAction(formData);
        }}>
            <SelectTrigger className="w-44">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="guest">Guest</SelectItem>
                <SelectItem value="user">User</SelectItem>
            </SelectContent>
        </Select>
    )

}