"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { useStore } from "@/lib/store"
import { fetchEmployees } from "@/lib/api"
import type { Employee } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Building,
  Bookmark,
  BookmarkCheck,
  TrendingUp,
  Calendar,
  MessageSquare,
  Briefcase,
  ArrowLeft,
} from "lucide-react"

export default function EmployeeDetail() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { employees, setEmployees, bookmarkedIds, toggleBookmark } = useStore()
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPromoting, setIsPromoting] = useState(false)

  const employeeId = Number.parseInt(params.id as string)
  const isBookmarked = bookmarkedIds.includes(employeeId)

  useEffect(() => {
    const loadEmployeeData = async () => {
      console.log("Loading employee data for ID:", employeeId)
      console.log("Current employees in store:", employees.length)

      // If no employees in store, fetch them first
      if (employees.length === 0) {
        console.log("No employees in store, fetching from API...")
        try {
          const fetchedEmployees = await fetchEmployees()
          console.log("Fetched employees:", fetchedEmployees.length)
          setEmployees(fetchedEmployees)

          // Find employee after fetching
          const foundEmployee = fetchedEmployees.find((emp) => emp.id === employeeId)
          console.log("Found employee after fetch:", foundEmployee)
          setEmployee(foundEmployee || null)
        } catch (error) {
          console.error("Error fetching employees:", error)
          setEmployee(null)
        }
      } else {
        // Find employee in existing store
        const foundEmployee = employees.find((emp) => emp.id === employeeId)
        console.log("Found employee in store:", foundEmployee)
        setEmployee(foundEmployee || null)
      }

      setLoading(false)
    }

    loadEmployeeData()
  }, [employeeId, employees, setEmployees])

  const handleBookmark = () => {
    if (!employee) return
    console.log("Bookmark clicked on detail page")
    toggleBookmark(employee.id)
    toast({
      title: isBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
      description: `${employee.firstName} ${employee.lastName} ${isBookmarked ? "removed from" : "added to"} your bookmarks.`,
    })
  }

  const handlePromote = async () => {
    if (!employee) return
    console.log("Promote clicked on detail page")
    setIsPromoting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast({
        title: "Promotion initiated! 🎉",
        description: `${employee.firstName} ${employee.lastName} has been marked for promotion review.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initiate promotion. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPromoting(false)
    }
  }

  const handleGoBack = () => {
    router.push("/")
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="w-24 h-24 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  if (!employee) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Employee Not Found</h1>
        <p className="text-muted-foreground mb-4">
          The employee with ID {employeeId} doesn't exist or has been removed.
        </p>
        <button
          onClick={handleGoBack}
          className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back to Dashboard
        </button>
      </div>
    )
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-500"
    if (rating >= 3) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={handleGoBack}
        className="inline-flex items-center px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </button>

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-6">
          <Image
            src={employee.image || "/placeholder.svg"}
            alt={`${employee.firstName} ${employee.lastName}`}
            width={96}
            height={96}
            className="rounded-full object-cover"
          />
          <div>
            <h1 className="text-3xl font-bold">
              {employee.firstName} {employee.lastName}
            </h1>
            <p className="text-lg text-muted-foreground">{employee.company.title}</p>
            <div className="flex items-center space-x-4 mt-2">
              <Badge variant="secondary">{employee.company.department}</Badge>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${star <= employee.rating ? "fill-current text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
                <span className={`text-sm font-medium ml-2 ${getRatingColor(employee.rating)}`}>
                  {employee.rating}/5
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleBookmark}
            className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors border ${
              isBookmarked
                ? "bg-purple-500 text-white border-purple-500 hover:bg-purple-600"
                : "bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            {isBookmarked ? <BookmarkCheck className="w-4 h-4 mr-2" /> : <Bookmark className="w-4 h-4 mr-2" />}
            {isBookmarked ? "Bookmarked" : "Bookmark"}
          </button>

          <button
            onClick={handlePromote}
            disabled={isPromoting}
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            {isPromoting ? "Processing..." : "Promote"}
          </button>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{employee.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{employee.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="font-medium">{employee.age} years old</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="w-5 h-5" />
                  <span>Company Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Company</p>
                  <p className="font-medium">{employee.company.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium">{employee.company.department}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Position</p>
                  <p className="font-medium">{employee.company.title}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Address</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  {employee.address.address}
                  <br />
                  {employee.address.city}, {employee.address.state} {employee.address.postalCode}
                  <br />
                  {employee.address.country}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5" />
                <span>Current Projects</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {employee.projects && employee.projects.length > 0 ? (
                  employee.projects.map((project, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">{project}</h4>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">Active</Badge>
                        <span className="text-sm text-muted-foreground">
                          {Math.floor(Math.random() * 80) + 20}% Complete
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No projects assigned</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>Performance Feedback</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employee.feedback && employee.feedback.length > 0 ? (
                  employee.feedback.map((feedback) => (
                    <div key={feedback.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium">{feedback.author}</p>
                          <p className="text-sm text-muted-foreground">{feedback.date}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                star <= feedback.rating ? "fill-current text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm">{feedback.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No feedback available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
