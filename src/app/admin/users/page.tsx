import { getUserList, getInvitations } from "../actions";
import { SendInviteForm } from "./SendInviteForm";
import { setRole, removeRole } from "../actions";
import { UpdateRoleForm } from "./UpdateRoleForm"
import { DeleteInviteBtn } from "./DeleteInviteBtn"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import { Trash2 } from "lucide-react"

export default async function Page() {
    const users = await getUserList().then((response) => response.data);
    const invitations = await getInvitations().then((response) => response.data);
    console.log(invitations);
    return (
        <div className="w-full space-y-8 p-6">
            <div className="grid grid-cols-1 gap-x-10 gap-y-8 lg:grid-cols-3">
                <div>
                    <h3 className="font-medium">Members</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage roles of existing members. As an admin, you can add, edit or delete users.
                    </p>
                    <SendInviteForm />
                </div>
                <div className="lg:col-span-2">
                    <ul className="space-y-4">
                        {users.map((user, index) => (
                            <div key={user.id}>
                                <li className="flex flex-col space-y-3 rounded-lg p-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                                    <div className="flex items-center space-x-4">
                                        <img src={user.imageUrl} alt={`${user.firstName} ${user.lastName}`} className="h-9 w-9 rounded-full" />
                                        <div>
                                            <p className="font-medium">{user.firstName} {user.lastName}</p>
                                            <p>
                                                {
                                                    user.emailAddresses.find((email) => email.id === user.primaryEmailAddressId)?.emailAddress
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <UpdateRoleForm role={user.publicMetadata?.role as string || "user"} setRoleAction={setRole} userId={user.id} />
                                        <form action={async () => {
                                            "use server"
                                            const formData = new FormData();
                                            formData.append("id", user.id);
                                            await removeRole(formData);
                                        }}>
                                            <Button type="submit" variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-error-500">
                                                <Trash2 />
                                            </Button>
                                        </form>
                                    </div>
                                </li>
                                {index !== users.length - 1 && <Separator />}
                            </div>
                        ))}
                    </ul>
                </div>
            </div>
            <Separator />
            <div className="grid grid-cols-1 gap-x-10 gap-y-8 lg:grid-cols-3">
                <div>
                    <h3 className="font-medium">Pending Invites</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Invited users who haven't accepted their invitation yet.
                    </p>
                </div>
                <div className="lg:col-span-2">
                    <ul className="space-y-4">
                        {(invitations).map((invitation) => (
                            <li key={invitation.id} className="flex flex-col space-y-3 rounded-lg border p-4 md:flex-row md:items-center md:justify-between md:space-y-8">
                                <div>
                                    <div>
                                        <p className="font-medium">{invitation.emailAddress}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <DeleteInviteBtn invitationId={invitation.id} emailAddress={invitation.emailAddress} />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}