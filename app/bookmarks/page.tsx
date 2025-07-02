"use client"

import { useState } from "react"
import { EmployeeCard } from "@/components/employee-card"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Bookmark, Trash2, UserPlus } from "lucide-react"

export default function BookmarksPage() {
  const { toast } = useToast()
  const { getBookmarkedEmployees, bookmarkedIds, toggleBookmark } = useStore()
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const bookmarkedEmployees = getBookmarkedEmployees()

  const handleSelectAll = () => {
    if (selectedIds.length === bookmarkedEmployees.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(bookmarkedEmployees.map((emp) => emp.id))
    }
  }

  const handleRemoveSelected = () => {
    selectedIds.forEach((id) => toggleBookmark(id))
    setSelectedIds([])
    toast({
      title: "Bookmarks removed",
      description: `${selectedIds.length} employee${selectedIds.length !== 1 ? "s" : ""} removed from bookmarks.`,
    })
  }

  const handleBulkAction = (action: string) => {
    toast({
      title: `${action} initiated`,
      description: `${selectedIds.length} employee${selectedIds.length !== 1 ? "s" : ""} marked for ${action.toLowerCase()}.`,
    })
    setSelectedIds([])
  }

  if (bookmarkedEmployees.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Bookmarked Employees</h1>
          <p className="text-muted-foreground mt-2">Manage your saved employees and perform bulk actions</p>
        </div>
        <div className="text-center py-12">
          <Bookmark className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No bookmarked employees</h3>
          <p className="text-muted-foreground">Start bookmarking employees from the dashboard to see them here</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold">Bookmarked Employees</h1>
          <p className="text-muted-foreground mt-2">
            {bookmarkedEmployees.length} employee{bookmarkedEmployees.length !== 1 ? "s" : ""} bookmarked
          </p>
        </div>
        {bookmarkedEmployees.length > 0 && (
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleSelectAll}>
              {selectedIds.length === bookmarkedEmployees.length ? "Deselect All" : "Select All"}
            </Button>
            {selectedIds.length > 0 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveSelected}
                  className="text-destructive hover:text-destructive bg-transparent"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove ({selectedIds.length})
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction("Promotion")}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Promote ({selectedIds.length})
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookmarkedEmployees.map((employee) => (
          <div key={employee.id} className="relative">
            <div className="absolute top-2 left-2 z-10">
              <input
                type="checkbox"
                checked={selectedIds.includes(employee.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedIds([...selectedIds, employee.id])
                  } else {
                    setSelectedIds(selectedIds.filter((id) => id !== employee.id))
                  }
                }}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
            </div>
            <EmployeeCard employee={employee} />
          </div>
        ))}
      </div>
    </div>
  )
}
