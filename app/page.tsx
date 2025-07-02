"use client"

import { useEffect, useState } from "react"
import { EmployeeCard } from "@/components/employee-card"
import { SearchFilters } from "@/components/search-filters"
import { useStore } from "@/lib/store"
import { fetchEmployees } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { Users, TrendingUp, Star, Bookmark, Award, Building, Activity } from "lucide-react"

function EmployeeCardSkeleton() {
  return (
    <div className="border rounded-xl p-3 sm:p-4 lg:p-6 space-y-4 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 h-full flex flex-col">
      <div className="flex items-start space-x-3 sm:space-x-4">
        <Skeleton className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 sm:h-5 w-3/4" />
          <Skeleton className="h-3 sm:h-4 w-1/2" />
          <div className="flex space-x-2">
            <Skeleton className="h-3 sm:h-4 w-12 sm:w-16" />
            <Skeleton className="h-5 sm:h-6 w-16 sm:w-20" />
          </div>
        </div>
      </div>
      <div className="space-y-2 flex-1">
        <Skeleton className="h-3 sm:h-4 w-full" />
        <Skeleton className="h-3 sm:h-4 w-2/3" />
      </div>
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 mt-auto">
        <Skeleton className="h-8 sm:h-9 lg:h-10 w-full sm:flex-1" />
        <div className="flex space-x-2 sm:contents">
          <Skeleton className="h-8 sm:h-9 lg:h-10 flex-1" />
          <Skeleton className="h-8 sm:h-9 lg:h-10 flex-1" />
        </div>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient,
  trend,
}: {
  title: string
  value: string | number
  subtitle: string
  icon: any
  gradient: string
  trend?: string
}) {
  return (
    <Card className="relative overflow-hidden border-0 professional-shadow hover-lift">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10`}></div>
      <CardContent className="p-4 sm:p-6 relative">
        <div className="flex items-center justify-between">
          <div className="space-y-1 sm:space-y-2 min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{title}</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              {value}
            </p>
            <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
            {trend && (
              <div className="flex items-center space-x-1">
                <Activity className="w-3 h-3 text-green-500 flex-shrink-0" />
                <span className="text-xs text-green-600 font-medium truncate">{trend}</span>
              </div>
            )}
          </div>
          <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg flex-shrink-0`}>
            <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Dashboard() {
  const { employees, setEmployees, getFilteredEmployees, bookmarkedIds } = useStore()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setLoading(true)
        const data = await fetchEmployees()
        setEmployees(data)
      } catch (err) {
        setError("Failed to load employees. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (employees.length === 0) {
      loadEmployees()
    } else {
      setLoading(false)
    }
  }, [employees.length, setEmployees])

  const filteredEmployees = getFilteredEmployees()

  const stats = {
    total: employees.length,
    bookmarked: bookmarkedIds.length,
    highPerformers: employees.filter((emp) => emp.rating >= 4).length,
    avgRating:
      employees.length > 0 ? (employees.reduce((sum, emp) => sum + emp.rating, 0) / employees.length).toFixed(1) : "0",
    departments: new Set(employees.map((emp) => emp.company.department)).size,
  }

  if (error) {
    return (
      <div className="space-y-6 px-4 sm:px-0">
        <div className="text-center py-8 sm:py-12">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            HR Performance Dashboard
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">Enterprise-grade employee management system</p>
        </div>
        <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-6 sm:p-8 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">HR Performance Dashboard</h1>
              <p className="text-blue-100 text-sm sm:text-base lg:text-lg">
                Comprehensive employee management and performance analytics
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs sm:text-sm text-blue-100">Live Data</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                  <span className="text-xs sm:text-sm text-blue-100">Enterprise Grade</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-24 h-24 lg:w-32 lg:h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Building className="w-12 h-12 lg:w-16 lg:h-16 text-white/80" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {!loading && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
            <StatCard
              title="Total Employees"
              value={stats.total}
              subtitle={`Across ${stats.departments} departments`}
              icon={Users}
              gradient="from-blue-500 to-cyan-600"
              trend="+12% this month"
            />
            <StatCard
              title="Bookmarked"
              value={stats.bookmarked}
              subtitle="Saved for review"
              icon={Bookmark}
              gradient="from-purple-500 to-pink-600"
              trend="+5 this week"
            />
            <StatCard
              title="High Performers"
              value={stats.highPerformers}
              subtitle={`${((stats.highPerformers / stats.total) * 100).toFixed(1)}% of total`}
              icon={TrendingUp}
              gradient="from-green-500 to-emerald-600"
              trend="+8% improvement"
            />
            <StatCard
              title="Average Rating"
              value={stats.avgRating}
              subtitle="Overall performance"
              icon={Star}
              gradient="from-yellow-500 to-orange-600"
              trend="+0.2 from last month"
            />
            <StatCard
              title="Departments"
              value={stats.departments}
              subtitle="Active divisions"
              icon={Building}
              gradient="from-indigo-500 to-purple-600"
            />
          </div>

          <SearchFilters />
        </>
      )}

      {/* Employee Grid */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Employee Directory
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              {loading ? "Loading employees..." : `${filteredEmployees.length} employees found`}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => <EmployeeCardSkeleton key={index} />)
          ) : filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee) => <EmployeeCard key={employee.id} employee={employee} />)
          ) : (
            <div className="col-span-full">
              <Card className="border-2 border-dashed border-gray-300 dark:border-gray-700">
                <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2">No employees found</h3>
                  <p className="text-muted-foreground text-center text-sm sm:text-base">
                    Try adjusting your search criteria or filters to find employees
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
