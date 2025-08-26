"use client"

import { useState } from "react"
import {
    LineChart,
    Line,
    XAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const chartData = [
    { date: "3 Oct", thisMonth: 1700, lastMonth: 300 },
    { date: "10 Oct", thisMonth: 2500, lastMonth: 1200 },
    { date: "14 Oct", thisMonth: 2100, lastMonth: 1050 },
    { date: "20 Oct", thisMonth: 3500, lastMonth: 2800 },
    { date: "23 Oct", thisMonth: 1900, lastMonth: 3600 },
    { date: "27 Oct", thisMonth: 1100, lastMonth: 3000 },
    { date: "30 Oct", thisMonth: 3600, lastMonth: 2000 },
]

export function RevenueReport() {
    const [period, setPeriod] = useState<"Day" | "Week" | "Month" | "Year">("Month")



    return (
        <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div>
                    <CardTitle className="mb-4">Revenue Report</CardTitle>
                    <CardDescription className="flex gap-2 flex-col">
                        <h1>
                            <span className="inline-block bg-[#797068] w-3 h-3 rounded-full mr-2"></span>
                            This Month
                        </h1>
                        <h1>
                            <span className="inline-block bg-[#4CC3FF] w-3 h-3 rounded-full mr-2"></span>
                            Last Month
                        </h1>
                    </CardDescription>
                </div>
                <div className="mt-2 sm:mt-0 flex gap-2 bg-[#E6E6E6] py-4 px-3 rounded-lg">
                    {["Day", "Week", "Month", "Year"].map((p) => (
                        <button
                            key={p}
                            className={`px-3 py-2 rounded-lg text-sm font-medium ${period === p ? "bg-btnPrimary text-white " : " text-[#595959]"
                                }`}
                            onClick={() => setPeriod(p as "Day" | "Week" | "Month" | "Year")}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </CardHeader>
            <CardContent>
                <div style={{ width: "100%", height: 280 }}>
                    <ResponsiveContainer>
                        <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                            <CartesianGrid vertical={false} stroke="#E5E7EB" />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: "#6B7280", fontSize: 12 }}
                            />
                            <Tooltip
                                cursor={false}
                                contentStyle={{ borderRadius: 8, border: "none", background: "#fff" }}
                                labelStyle={{ fontWeight: "bold" }}
                            />
                            <Line type="monotone" dataKey="thisMonth" stroke="#27272A" strokeWidth={2} dot={true} />
                            <Line type="monotone" dataKey="lastMonth" stroke="#0EA5E9" strokeWidth={2} dot={true} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>

        </Card>
    )
}
