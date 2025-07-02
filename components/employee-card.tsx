"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useStore } from "@/lib/store"
import type { Employee } from "@/lib/store"
import { Star, Bookmark, Eye, TrendingUp, BookmarkCheck } from "lucide-react"

interface EmployeeCardProps {
  employee: Employee
}

export function EmployeeCard({ employee }: EmployeeCardProps) {
  const { toast } = useToast()
  const { bookmarkedIds, toggleBookmark } = useStore()
  const [isPromoting, setIsPromoting] = useState(false)

  const isBookmarked = bookmarkedIds.includes(employee.id)

  const handleViewDetails = () => {
    console.log("View Details clicked for:", employee.firstName, employee.lastName)
    window.location.href = `/employee/${employee.id}`
  }

  const handleBookmark = () => {
    console.log("Bookmark clicked for:", employee.firstName, employee.lastName)
    toggleBookmark(employee.id)
    toast({
      title: isBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
      description: `${employee.firstName} ${employee.lastName} ${isBookmarked ? "removed from" : "added to"} your bookmarks.`,
    })
  }

  const handlePromote = async () => {
    console.log("Promote clicked for:", employee.firstName, employee.lastName)
    setIsPromoting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsPromoting(false)
    toast({
      title: "Promotion initiated! 🎉",
      description: `${employee.firstName} ${employee.lastName} has been marked for promotion review.`,
    })
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-500"
    if (rating >= 3) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <Image
              src={employee.image || "/placeholder.svg"}
              alt={`${employee.firstName} ${employee.lastName}`}
              width={64}
              height={64}
              className="rounded-full object-cover"
            />
            <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1">
              <div
                className={`w-3 h-3 rounded-full ${employee.rating >= 4 ? "bg-green-500" : employee.rating >= 3 ? "bg-yellow-500" : "bg-red-500"}`}
              />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">
              {employee.firstName} {employee.lastName}
            </h3>
            <p className="text-sm text-muted-foreground truncate">{employee.email}</p>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-sm text-muted-foreground">Age: {employee.age}</span>
              <Badge variant="secondary">{employee.company.department}</Badge>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center space-x-1 mb-2">
            <span className="text-sm font-medium">Performance:</span>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${star <= employee.rating ? "fill-current text-yellow-400" : "text-gray-300"}`}
                />
              ))}
              <span className={`text-sm font-medium ml-2 ${getRatingColor(employee.rating)}`}>{employee.rating}/5</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {employee.company.title} at {employee.company.name}
          </p>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex space-x-2">
        {/* View Details Button */}
        <button
          onClick={handleViewDetails}
          className="flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3 cursor-pointer"
        >
          <Eye className="w-4 h-4 mr-2" />
          View
        </button>

        {/* Bookmark Button */}
        <button
          onClick={handleBookmark}
          className={`flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-9 px-3 cursor-pointer ${
            isBookmarked ? "bg-purple-500 text-white border-purple-500 hover:bg-purple-600" : "bg-transparent"
          }`}
        >
          {isBookmarked ? <BookmarkCheck className="w-4 h-4 mr-2" /> : <Bookmark className="w-4 h-4 mr-2" />}
          {isBookmarked ? "Saved" : "Bookmark"}
        </button>

        {/* Promote Button */}
        <button
          onClick={handlePromote}
          disabled={isPromoting}
          className="flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent hover:bg-accent hover:text-accent-foreground h-9 px-3 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          {isPromoting ? "Processing..." : "Promote"}
        </button>
      </CardFooter>
    </Card>
  )
}
