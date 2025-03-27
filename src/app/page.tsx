import Image from "next/image";
import { MetricCards, type Metric } from "../components/metric-cards"
import { UsersTable, type User } from "@/components/users-table"
import { AdBanner } from "@/components/ad-banner"
import { QuickLinks } from "@/components/quick-links"
import { Users, DollarSign, CreditCard, Activity } from 'lucide-react';
import { ChartPie } from "@/components/chart-pie"
import { ChartLine } from "@/components/chart-line"


import { getSubscriptionsCount, getSubscriptionBreakdown, getActiveSubsByPlanPerMonth, getUserCount, getUserList } from "@/app/admin/actions"

const users: User[] = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    lastSignInAt: 1708423800000,
    emailAddresses: [
      {
        id: 101,
        emailAddress: "john.doe@example.com"
      }
    ]
  },
  {
    id: 2,
    firstName: "Alice",
    lastName: "Smith",
    lastSignInAt: 1708356300000,
    emailAddresses: [
      {
        id: 201,
        emailAddress: "alice.work@company.com"
      },
      {
        id: 202,
        emailAddress: "alice.personal@email.com"
      }
    ]
  },
  {
    id: 3,
    lastName: "Johnson",
    lastSignInAt: 1708246500000,
    emailAddresses: [
      {
        id: 301,
        emailAddress: "johnson@example.com"
      }
    ]
  },
  {
    id: 4,
    firstName: "Maria",
    lastName: "Garcia",
    lastSignInAt: 1708416000000,
    emailAddresses: [
      {
        id: 401,
        emailAddress: "maria.garcia@company.com"
      }
    ]
  },
  {
    id: 5,
    firstName: "David",
    lastSignInAt: 1708184400000,
    emailAddresses: [
      {
        id: 501,
        emailAddress: "david.temp@example.com"
      }
    ]
  }
];
export default async function Home() {
  const subscriptions = await getSubscriptionsCount();
  const subsBreakdown = await getSubscriptionBreakdown();
  const subsPerMonth = await getActiveSubsByPlanPerMonth();
  const userCount = await getUserCount();
  const usersClerk = await getUserList();
  console.log(usersClerk)

  const metrics: Metric[] = [
    {
      title: "Users",
      value: userCount,
      change: "+60% from last month",
      icon: <Users className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: "Subscriptions",
      value: subscriptions,
      change: "+100% from last month",
      icon: <CreditCard className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: "Revenue",
      value: "$200",
      change: "+200% from last year",
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: "Last Month Subscriptions",
      value: 30,
      change: "+10 in the last week",
      icon: <Activity className="h-4 w-4 text-muted-foreground" />
    }
  ]
  return (
    <main className="container mx-auto p-4 space-y-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <MetricCards metrics={metrics} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <ChartLine data={subsPerMonth} />
        </div>
        <div className="flex flex-col space-y-4">
          <AdBanner />
          <QuickLinks />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Recent Users</h2>
            <UsersTable data={usersClerk.data} />
          </div>
        </div>
        <ChartPie data={subsBreakdown} />
      </div>
    </main>
  );
}
