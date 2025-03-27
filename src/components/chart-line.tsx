"use client"

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartConfig = {
    monthly: {
        label: "Monthly Active Subscriptions",
        color: "hsl(var(--chart-1))",
    },
    yearly: {
        label: "Yearly Active Subscriptions",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

type DataItem = {
    month: string,
    monthLabel: string,
    yearlySubscriptions: string,
    monthlySubscriptions: string,
}

export function ChartLine({ data }: { data: DataItem[] }) {
    return (
        <Card>
            <CardHeader>
                <div>
                    <CardTitle>Subscription Trends</CardTitle>
                    <CardDescription>Yearly vs Monthly Subscriptions</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <LineChart accessibilityLayer data={data} margin={{
                        top: 5,
                        right: 10,
                    }}>
                        <CartesianGrid veritcal={false} />
                        <XAxis dataKey="monthLabel" tickline={false} axisLine={false} tickMargin={6} />
                        <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
                        <Line dataKey="yearlySubscriptions" type="monotone" stroke="var(--color-yearly)" strokeWidth={2} dot={false} />
                        <Line dataKey="monthlySubscriptions" type="monotone" stroke="var(--color-monthly)" strokeWidth={2} dot={false} />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

