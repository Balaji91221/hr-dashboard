"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/lib/store"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts"
import { Users, Star, Building, Award, TrendingUp, Activity } from "lucide-react"

const COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Violet
  "#06B6D4", // Cyan
  "#84CC16", // Lime
  "#F97316", // Orange
]

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient,
  trend,
  trendUp = true,
}: {
  title: string
  value: string | number
  subtitle: string
  icon: any
  gradient: string
  trend?: string
  trendUp?: boolean
}) {
  return (
    <Card className="relative overflow-hidden border-0 professional-shadow hover-lift">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10`}></div>
      <CardContent className="p-6 relative">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              {value}
            </p>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
            {trend && (
              <div className="flex items-center space-x-1">
                <TrendingUp
                  className={`w-3 h-3 ${trendUp ? "text-green-500" : "text-red-500"} ${!trendUp && "rotate-180"}`}
                />
                <span className={`text-xs font-medium ${trendUp ? "text-green-600" : "text-red-600"}`}>{trend}</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AnalyticsPage() {
  const { employees, bookmarkedIds } = useStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-700 p-8 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
            <p className="text-indigo-100 text-lg">Loading performance insights and organizational metrics...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 animate-pulse rounded-xl"
            />
          ))}
        </div>
      </div>
    )
  }

  // Calculate department-wise average ratings
  const departmentStats = employees.reduce(
    (acc, employee) => {
      const dept = employee.company.department
      if (!acc[dept]) {
        acc[dept] = { total: 0, count: 0, employees: [] }
      }
      acc[dept].total += employee.rating
      acc[dept].count += 1
      acc[dept].employees.push(employee)
      return acc
    },
    {} as Record<string, { total: number; count: number; employees: any[] }>,
  )

  const departmentData = Object.entries(departmentStats).map(([dept, stats]) => ({
    department: dept,
    avgRating: Number((stats.total / stats.count).toFixed(1)),
    employeeCount: stats.count,
    highPerformers: stats.employees.filter((emp) => emp.rating >= 4).length,
  }))

  // Rating distribution
  const ratingDistribution = [1, 2, 3, 4, 5].map((rating) => ({
    rating: `${rating} Star${rating !== 1 ? "s" : ""}`,
    count: employees.filter((emp) => emp.rating === rating).length,
    value: rating,
  }))

  // Performance trends (mock data for demonstration)
  const performanceTrends = [
    { month: "Jan", avgRating: 3.2, bookmarks: 5, satisfaction: 78 },
    { month: "Feb", avgRating: 3.4, bookmarks: 8, satisfaction: 82 },
    { month: "Mar", avgRating: 3.6, bookmarks: 12, satisfaction: 85 },
    { month: "Apr", avgRating: 3.8, bookmarks: 15, satisfaction: 88 },
    { month: "May", avgRating: 3.9, bookmarks: 18, satisfaction: 91 },
    { month: "Jun", avgRating: 4.1, bookmarks: bookmarkedIds.length, satisfaction: 94 },
  ]

  const totalEmployees = employees.length
  const avgRating =
    totalEmployees > 0 ? (employees.reduce((sum, emp) => sum + emp.rating, 0) / totalEmployees).toFixed(1) : "0"
  const highPerformers = employees.filter((emp) => emp.rating >= 4).length
  const topDepartment = departmentData.reduce(
    (prev, current) => (prev.avgRating > current.avgRating ? prev : current),
    departmentData[0],
  )

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-700 p-8 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
              <p className="text-indigo-100 text-lg">Advanced performance insights and organizational metrics</p>
              <div className="flex items-center space-x-4 mt-4">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-indigo-100">Real-time Analytics</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-indigo-100">Performance Tracking</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Activity className="w-16 h-16 text-white/80" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Employees"
          value={totalEmployees}
          subtitle={`Across ${Object.keys(departmentStats).length} departments`}
          icon={Users}
          gradient="from-blue-500 to-cyan-600"
          trend="+12% this month"
        />
        <StatCard
          title="Average Rating"
          value={avgRating}
          subtitle="Overall performance score"
          icon={Star}
          gradient="from-yellow-500 to-orange-600"
          trend="+0.3 improvement"
        />
        <StatCard
          title="High Performers"
          value={highPerformers}
          subtitle={`${((highPerformers / totalEmployees) * 100).toFixed(1)}% of workforce`}
          icon={Award}
          gradient="from-green-500 to-emerald-600"
          trend="+15% increase"
        />
        <StatCard
          title="Top Department"
          value={topDepartment?.avgRating || "N/A"}
          subtitle={topDepartment?.department || "None"}
          icon={Building}
          gradient="from-purple-500 to-pink-600"
          trend="Leading performance"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-0 professional-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Department Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={departmentData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis dataKey="department" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar dataKey="avgRating" fill="url(#colorGradient)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 professional-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Rating Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={ratingDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ rating, count, percent }) => `${rating}: ${count} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {ratingDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-0 professional-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Performance Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={performanceTrends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="avgRating"
                  stroke="#3B82F6"
                  fill="url(#colorGradient2)"
                  strokeWidth={3}
                  name="Average Rating"
                />
                <defs>
                  <linearGradient id="colorGradient2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 professional-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Employee Satisfaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={performanceTrends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis domain={[70, 100]} tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="satisfaction"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: "#10B981", strokeWidth: 2, r: 6 }}
                  name="Satisfaction %"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Department Details Table */}
      <Card className="border-0 professional-shadow">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Department Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                  <th className="text-left p-4 font-semibold">Department</th>
                  <th className="text-left p-4 font-semibold">Employees</th>
                  <th className="text-left p-4 font-semibold">Avg Rating</th>
                  <th className="text-left p-4 font-semibold">High Performers</th>
                  <th className="text-left p-4 font-semibold">Performance</th>
                </tr>
              </thead>
              <tbody>
                {departmentData.map((dept, index) => (
                  <tr
                    key={dept.department}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full bg-gradient-to-r ${COLORS[index % COLORS.length]} opacity-80`}
                        ></div>
                        <span className="font-medium">{dept.department}</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{dept.employeeCount}</td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 fill-current text-yellow-400" />
                        <span className="font-semibold">{dept.avgRating}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {dept.highPerformers}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${(dept.avgRating / 5) * 100}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
