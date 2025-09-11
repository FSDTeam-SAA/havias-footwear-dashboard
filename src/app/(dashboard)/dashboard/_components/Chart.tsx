"use client"

import { useState, useMemo } from "react"
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"

export function RevenueReport() {
  const [period, setPeriod] = useState<"day" | "week" | "month" | "year">("month")

  const session = useSession()
  const token = (session?.data?.user as { accessToken: string })?.accessToken

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["revenue-report", period],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/admin/revenue?filter=${period}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      if (!res.ok) throw new Error("Failed to fetch revenue report")
      return res.json()
    },
    enabled: !!token,
  })

  // Normalize API response into a consistent format
  const chartData = useMemo(() => {
    if (!data?.data) return []

    switch (period) {
      case "day":
        return data.data.map((item: { date: string; revenue: number }) => ({
          label: item.date,
          revenue: item.revenue,
        }))
      case "week":
        return data.data.map((item: { day: string; revenue: number }) => ({
          label: item.day,
          revenue: item.revenue,
        }))
      case "month":
        return data.data.map((item: { month: string; revenue: number }) => ({
          label: item.month,
          revenue: item.revenue,
        }))
      case "year":
        return data.data.map((item: { year: number; revenue: number }) => ({
          label: item.year.toString(),
          revenue: item.revenue,
        }))
      default:
        return []
    }
  }, [data, period])

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div>
          <CardTitle className="mb-4">Revenue Report</CardTitle>
        </div>
        <div className="mt-2 sm:mt-0 flex gap-2 bg-[#E6E6E6] py-2 px-3 rounded-lg">
          {["Day", "Week", "Month", "Year"].map((p) => (
            <button
              key={p}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                period.toLowerCase() === p.toLowerCase()
                  ? "bg-btnPrimary text-white"
                  : "text-[#595959]"
              }`}
              onClick={() =>
                setPeriod(p.toLowerCase() as "day" | "week" | "month" | "year")
              }
            >
              {p}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div style={{ width: "100%", height: 280 }} className="flex items-center justify-center">
          {/* Loading State */}
          {isLoading && (
            <div className="w-full h-full flex items-center justify-center">
              <Skeleton className="w-full h-[200px] rounded-lg" />
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="flex flex-col items-center gap-2">
              <p className="text-red-500">Failed to load revenue data.</p>
              <button
                onClick={() => refetch()}
                className="px-3 py-1 rounded-md bg-btnPrimary text-white text-sm"
              >
                Retry
              </button>
            </div>
          )}

          {/* Chart */}
          {!isLoading && !isError && chartData.length > 0 && (
            <ResponsiveContainer>
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
              >
                <CartesianGrid vertical={false} stroke="#E5E7EB" />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                />
                <Tooltip
                  cursor={false}
                  contentStyle={{
                    borderRadius: 8,
                    border: "none",
                    background: "#fff",
                  }}
                  labelStyle={{ fontWeight: "bold" }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0EA5E9"
                  strokeWidth={2}
                  dot={true}
                />
              </LineChart>
            </ResponsiveContainer>
          )}

          {/* Empty State */}
          {!isLoading && !isError && chartData.length === 0 && (
            <p className="text-gray-500">No revenue data available.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
