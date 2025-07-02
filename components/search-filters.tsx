"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { useStore } from "@/lib/store"
import { Search, X, Sliders } from "lucide-react"

const departments = [
  "Engineering",
  "Marketing",
  "Sales",
  "HR",
  "Finance",
  "Operations",
  "Design",
  "Product",
  "Legal",
  "Support",
]

const ratings = [1, 2, 3, 4, 5]

export function SearchFilters() {
  const {
    searchQuery,
    selectedDepartments,
    selectedRatings,
    setSearchQuery,
    setSelectedDepartments,
    setSelectedRatings,
  } = useStore()
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const handleDepartmentChange = (department: string, checked: boolean) => {
    if (checked) {
      setSelectedDepartments([...selectedDepartments, department])
    } else {
      setSelectedDepartments(selectedDepartments.filter((d) => d !== department))
    }
  }

  const handleRatingChange = (rating: number, checked: boolean) => {
    if (checked) {
      setSelectedRatings([...selectedRatings, rating])
    } else {
      setSelectedRatings(selectedRatings.filter((r) => r !== rating))
    }
  }

  const clearFilters = () => {
    setSelectedDepartments([])
    setSelectedRatings([])
    setSearchQuery("")
  }

  const activeFiltersCount = selectedDepartments.length + selectedRatings.length

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5" />
          <Input
            placeholder="Search employees by name, email, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 sm:pl-12 h-10 sm:h-12 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
          />
        </div>

        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="relative h-10 sm:h-12 px-4 sm:px-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm hover:border-purple-400 transition-all duration-200 text-sm sm:text-base"
            >
              <Sliders className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="hidden sm:inline">Advanced Filters</span>
              <span className="sm:hidden">Filters</span>
              {activeFiltersCount > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xs"
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-72 sm:w-80 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm"
            align="end"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-base sm:text-lg">Filter Options</h4>
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-auto p-2 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </Button>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold mb-3 block text-gray-700 dark:text-gray-300">Department</label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {departments.map((department) => (
                    <div
                      key={department}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <Checkbox
                        id={department}
                        checked={selectedDepartments.includes(department)}
                        onCheckedChange={(checked) => handleDepartmentChange(department, checked as boolean)}
                        className="border-2"
                      />
                      <label htmlFor={department} className="text-sm font-medium cursor-pointer flex-1">
                        {department}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold mb-3 block text-gray-700 dark:text-gray-300">
                  Performance Rating
                </label>
                <div className="space-y-2">
                  {ratings.map((rating) => (
                    <div
                      key={rating}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <Checkbox
                        id={`rating-${rating}`}
                        checked={selectedRatings.includes(rating)}
                        onCheckedChange={(checked) => handleRatingChange(rating, checked as boolean)}
                        className="border-2"
                      />
                      <label htmlFor={`rating-${rating}`} className="text-sm font-medium cursor-pointer flex-1">
                        {rating} Star{rating !== 1 ? "s" : ""} & Above
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {(selectedDepartments.length > 0 || selectedRatings.length > 0) && (
        <div className="flex flex-wrap gap-2">
          {selectedDepartments.map((department) => (
            <Badge
              key={department}
              variant="secondary"
              className="cursor-pointer bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:from-blue-600 hover:to-cyan-700 transition-all duration-200 text-xs"
            >
              {department}
              <X
                className="w-3 h-3 ml-2 hover:bg-white/20 rounded-full p-0.5"
                onClick={() => handleDepartmentChange(department, false)}
              />
            </Badge>
          ))}
          {selectedRatings.map((rating) => (
            <Badge
              key={rating}
              variant="secondary"
              className="cursor-pointer bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700 transition-all duration-200 text-xs"
            >
              {rating} Star{rating !== 1 ? "s" : ""}
              <X
                className="w-3 h-3 ml-2 hover:bg-white/20 rounded-full p-0.5"
                onClick={() => handleRatingChange(rating, false)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
