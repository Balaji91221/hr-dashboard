import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Employee {
  id: number
  firstName: string
  lastName: string
  email: string
  age: number
  phone: string
  address: {
    address: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  company: {
    department: string
    name: string
    title: string
  }
  image: string
  rating: number
  projects: string[]
  feedback: Array<{
    id: string
    author: string
    comment: string
    date: string
    rating: number
  }>
}

interface StoreState {
  employees: Employee[]
  bookmarkedIds: number[]
  searchQuery: string
  selectedDepartments: string[]
  selectedRatings: number[]
  setEmployees: (employees: Employee[]) => void
  toggleBookmark: (id: number) => void
  setSearchQuery: (query: string) => void
  setSelectedDepartments: (departments: string[]) => void
  setSelectedRatings: (ratings: number[]) => void
  getFilteredEmployees: () => Employee[]
  getBookmarkedEmployees: () => Employee[]
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      employees: [],
      bookmarkedIds: [],
      searchQuery: "",
      selectedDepartments: [],
      selectedRatings: [],

      setEmployees: (employees) => {
        console.log("Setting employees:", employees.length)
        set({ employees })
      },

      toggleBookmark: (id) => {
        console.log("Toggle bookmark called for ID:", id)
        const currentBookmarks = get().bookmarkedIds
        console.log("Current bookmarks:", currentBookmarks)

        const isBookmarked = currentBookmarks.includes(id)
        console.log("Is currently bookmarked:", isBookmarked)

        const newBookmarks = isBookmarked
          ? currentBookmarks.filter((bookmarkId) => bookmarkId !== id)
          : [...currentBookmarks, id]

        console.log("New bookmarks:", newBookmarks)
        set({ bookmarkedIds: newBookmarks })
      },

      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedDepartments: (departments) => set({ selectedDepartments: departments }),
      setSelectedRatings: (ratings) => set({ selectedRatings: ratings }),

      getFilteredEmployees: () => {
        const { employees, searchQuery, selectedDepartments, selectedRatings } = get()
        return employees.filter((employee) => {
          const matchesSearch =
            !searchQuery ||
            employee.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            employee.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            employee.company.department.toLowerCase().includes(searchQuery.toLowerCase())

          const matchesDepartment =
            selectedDepartments.length === 0 || selectedDepartments.includes(employee.company.department)

          const matchesRating = selectedRatings.length === 0 || selectedRatings.includes(employee.rating)

          return matchesSearch && matchesDepartment && matchesRating
        })
      },

      getBookmarkedEmployees: () => {
        const { employees, bookmarkedIds } = get()
        return employees.filter((employee) => bookmarkedIds.includes(employee.id))
      },
    }),
    {
      name: "hr-dashboard-storage",
      partialize: (state) => ({ bookmarkedIds: state.bookmarkedIds }),
    },
  ),
)
