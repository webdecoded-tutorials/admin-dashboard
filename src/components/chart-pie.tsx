"use client";

import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart, LabelProps } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

type DataItem = {
    plan: string,
    total: string,
}

type ChartPieProps = {
    data: DataItem[],
}

type ViewBox = NonNullable<LabelProps["viewBox"]>

export function ChartPie({ data }: ChartPieProps) {
    console.log(data)
    const processedData = data.map((item, i) => {
        let index = i + 1;
        return {
            ...item,
            total: parseInt(item.total, 10),
            fill: `hsl(var(--chart-${index}))`
        }
    })


    const totalSubs: number = processedData.reduce((acc, item) => acc + item.total, 0)
    const chartConfig: ChartConfig = {
        total: {
            label: "Subscriptions",
        }
    }

    data.forEach((item, i) => {
        let index = i + 1;
        chartConfig[item.plan] = {
            label: item.plan.charAt(0).toUpperCase() + item.plan.slice(1),
            color: `hsl(var(--chart-${index}))`,
        }
    })

    return (
        <Card>
            <CardHeader className="text-center">
                <CardTitle>Subscriptions Breakdown</CardTitle>
                <CardDescription className="text-xs md:text-normal">Showing total subscriptions for all time</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
                    <PieChart width={730} height={250}>
                        <ChartTooltip content={<ChartTooltipContent hideLabel />} cursor={false} />
                        <Pie data={processedData} dataKey="total" nameKey="plan" innerRadius={60} strokeWidth={5}>
                            <Label
                                content={({ viewBox }: ViewBox) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                                <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                                                    {totalSubs.toLocaleString()}
                                                </tspan>
                                                <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                                                    Subscriptions
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}