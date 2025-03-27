"use client"
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { useUser } from "@clerk/nextjs"

import {
    Home,
    Users,
    Settings,
    GitPullRequestArrow
} from "lucide-react"

import { usePathname } from "next/navigation"
import Link from "next/link"



export function AppSideBar() {
    const pathname = usePathname()
    const { user } = useUser()
    console.log(user)
    const metadata = user?.publicMetadata
    const role = metadata?.role

    const sideBarItems: {
        name: string;
        href: string;
        icon: React.ReactNode;
    }[] = [
            {
                name: "Dashboard",
                href: "/",
                icon: <Home />
            },
            ...(role && role === "admin" ? [
                { name: "Users", href: "/admin/users", icon: <Users /> }
            ] : []),
            { name: "Support", href: "/requests", icon: <GitPullRequestArrow /> },
            { name: "Settings", href: "/settings", icon: <Settings /> }
        ]

    return (
        <Sidebar side="left">
            <SidebarHeader>
                {/* <SidebarTrigger /> */}
                <h1 className="text-2xl font-bold text-primary">Admin Portal</h1>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    {sideBarItems.map((item, index) => (
                        <SidebarMenuItem key={index} >
                            <SidebarMenuButton asChild isActive={pathname === item.href}>
                                <Link href={item.href}>
                                    {item.icon}
                                    <span>{item.name}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
    )
}