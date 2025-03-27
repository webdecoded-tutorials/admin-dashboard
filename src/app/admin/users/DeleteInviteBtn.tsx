"use client"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"

import { revokeInvitation } from "../actions"

export const DeleteInviteBtn = (props: { invitationId: string, emailAddress: string }) => {
    const { invitationId, emailAddress } = props;

    const handleRevokeInvitation = async () => {
        const response = await revokeInvitation(invitationId);
        console.log(response);
        if (response.status === 'success') {
            toast("Invitation revoked", {
                description: "The invitation has been successfully revoked.",
            })
        } else {
            toast("Error", {
                description: "An error occurred while revoking the invitation.",
            })
        }
    }
    return (
        <>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-error-500" onClick={() => handleRevokeInvitation()}>
                <Trash2 />
                <span className="sr-only">Delete invite for {emailAddress}</span>
            </Button>
        </>
    )
}