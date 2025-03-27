"use server"

import { db } from "@/db";
import { subscriptionsTable } from "@/db/schema";

import { count, sql, asc, and, or, eq, isNull } from "drizzle-orm";

import { auth, clerkClient } from "@clerk/nextjs/server";

import { Roles } from "@/types/globals";

import { revalidatePath } from "next/cache"

export type ActionStatus = "success" | "error" | "warning" | "default"

export const checkRole = async(role: Roles) => {
    const { sessionClaims } = await auth();
    return sessionClaims?.metadata.role === role;
}

export async function setRole(formData: FormData) {
    const client = await clerkClient();
    console.log(checkRole("admin"));
    if (!checkRole("admin")) {
        return {
            status: "error" as ActionStatus,
            message: "Unauthorized",
        }
    }

    try {
        const res = await client.users.updateUserMetadata(formData.get("id") as string, {
            publicMetadata: {
                role: formData.get("role") as Roles,
            }
        })
        return {
            message: res.publicMetadata
        }
    } catch(err) {
        console.log(err);
        return {
            status: "error" as ActionStatus,
            message: err
        }
    }
}

export async function removeRole(formData: FormData) {
    const client = await clerkClient();

    if (!checkRole("admin")) {
        return {
            status: "error" as ActionStatus,
            message: "Unauthorized",
        }
    }

    try {
        const res = await client.users.updateUserMetadata(formData.get("id") as string, {
            publicMetadata: {
                role: null,
            }
        })
        return {
            message: res.publicMetadata
        }
    } catch(err) {
        return {
            status: "error" as ActionStatus,
            message: err
        }
    }
}

export async function getInvitations() {
    const client = await clerkClient();
    const invitations = await client.invitations.getInvitationList({
        status: "pending",
    });
    return invitations;
}

export async function revokeInvitation(invitationId: string) {
    const client = await clerkClient();
    try {
    const res = await client.invitations.revokeInvitation(invitationId);
    revalidatePath("/admin/users");
    return {
        message: res.revoked,
        status: res.revoked ? "success" as ActionStatus : "error" as ActionStatus
    }
    } catch(err) {
        return {
            status: "error" as ActionStatus,
            message: err
        }
    }
}

export async function getUserCount() {
    const client = await clerkClient();
    const data = await client.users.getCount();
    return data;
}

export async function getUserList() {
    const client = await clerkClient();
    const data = await client.users.getUserList();
    return data;
}

export async function getSubscriptionsCount() {
    const data = await db.select({ count: count()}).from(subscriptionsTable);
    return data[0].count;
}

export async function sendInvitation(
    state: {
        message: string;
        status: ActionStatus;
    }, 
    formData: FormData
): Promise<{
    message: string;
    status: ActionStatus;
}>  {
    const client = await clerkClient();
    const email = formData.get("email") as string;
    const role = "user";

    const inviteParams  = {
        emailAddress: email,
        publicMetadata: {
            role,
        },
    }

    // Check if the user was already invited or is an user with an email address
    const invitations = await client.invitations.getInvitationList({
        status: "pending",
    })
    const existingInvitation = invitations.data.find(invitation => invitation.emailAddress === email);

    if (existingInvitation) {
        return {
            status: "warning" as ActionStatus,
            message: "User already invited!",
        };
    }

    try {
        const invitation = await client.invitations.createInvitation(inviteParams);
        if (invitation.status !== "pending") {
            return {
                status: "error" as ActionStatus,
                message: "Failed to send invitation!",
            };
        }
        revalidatePath("/admin/users");
        return {
            status: "success" as ActionStatus,
            message: "Invitation sent!",
        };
    } catch (error) {
        return {
            status: "error" as ActionStatus,
            message: "Failed to send invitation!",
        };
    }
} 

export async function getSubscriptionBreakdown() {
    const breakdown = await db.select({
        plan: subscriptionsTable.plan,
        total: sql<number>`count(*)`,
    }).from(subscriptionsTable)
    .where(and(
        or(
            eq(subscriptionsTable.plan, "basic"),
            eq(subscriptionsTable.plan, "premium"),
            eq(subscriptionsTable.plan, "free"),
        ),
        isNull(subscriptionsTable.endDate)
    ))
    .groupBy(subscriptionsTable.plan)

    return breakdown;
}

export async function getActiveSubsByPlanPerMonth(interval: number = 12) {
    const monthOverMonthSubscriptions = await db.select({
        month: sql<Date>`date_trunc('month', series.month)`,
        monthLabel: sql<string>`to_char(date_trunc('month', series.month), 'Mon YYYY')`,
        yearlySubscriptions: sql<number>`count(*) filter (where ${subscriptionsTable.type} = 'yearly'
        and ${subscriptionsTable.startDate} <= series.month
        and (${subscriptionsTable.endDate} is null or ${subscriptionsTable.endDate} >= series.month))`,
        monthlySubscriptions: sql<number>`count(*) filter (where ${subscriptionsTable.type} = 'monthly'
        and ${subscriptionsTable.startDate} <= series.month
        and (${subscriptionsTable.endDate} is null or ${subscriptionsTable.endDate} >= series.month))`,
    })
    .from(sql`
    (
      SELECT generate_series(
        DATE_TRUNC('month', CURRENT_DATE - (${interval}::integer || ' months')::interval),
        DATE_TRUNC('month', CURRENT_DATE),
        '1 month'::interval
      ) as month
    ) as series
    `)
    .leftJoin(
        subscriptionsTable,
        sql`
        ${subscriptionsTable.startDate} <= series.month
        and (
        ${subscriptionsTable.endDate} is null
        or ${subscriptionsTable.endDate} > series.month
        )
    `
    )
    .groupBy(sql`DATE_TRUNC('month', series.month)`,
        sql`to_char(date_trunc('month', series.month), 'Mon YYYY')`)
    .orderBy(asc(sql`DATE_TRUNC('month', series.month)`))

    return monthOverMonthSubscriptions;
}