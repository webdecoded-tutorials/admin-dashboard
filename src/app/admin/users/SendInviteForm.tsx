"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { sendInvitation, type ActionStatus } from "../actions"
import { useActionState } from "react";
import cn from "clsx";

export const SendInviteForm = () => {
    const [state, formAction] = useActionState<{
        message: string, status: ActionStatus
    }, FormData>(sendInvitation, { message: "", status: "default" });

    const msgVariants: Record<ActionStatus, string> = {
        default: "",
        success: "text-success-500",
        error: "text-error-500",
        warning: "text-warning-500",
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="mt-4">Invite a Member</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invite a Member</DialogTitle>
                    <DialogDescription>
                        Enter the email address of the user you want to invite
                    </DialogDescription>
                </DialogHeader>
                <form action={formAction}>
                    <div className="grid gap-1 py-4">
                        {state.message && <p className={cn(msgVariants[state.status])}>{state.message}</p>}
                        <div className="flex flex-row space-y-4 gap-2 items-end">
                            <Input id="email" name="email" type="email" placeholder="example@gmail.com" required />
                            <Button type="submit" className="mt-0">
                                Send an invite
                            </Button>
                        </div>
                    </div></form>
            </DialogContent>
        </Dialog>
    )
}
