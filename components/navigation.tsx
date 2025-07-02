"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LayoutDashboard, Bookmark, BarChart3, Building2, Menu } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Bookmarks", href: "/bookmarks", icon: Bookmark },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
]

export function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const NavItems = ({ mobile = false, onItemClick }: { mobile?: boolean; onItemClick?: () => void }) => (
    <>
      {navigation.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        return (
          <Button
            key={item.name}
            variant={isActive ? "default" : "ghost"}
            asChild
            className={`${
              mobile ? "w-full justify-start text-base h-12" : "flex items-center space-x-2"
            } relative overflow-hidden group ${
              isActive ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg" : "hover:bg-muted/50"
            }`}
            onClick={onItemClick}
          >
            <Link href={item.href}>
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-10"></div>
              )}
              <Icon className={`h-4 w-4 ${mobile ? "mr-3" : ""}`} />
              <span className="font-medium">{item.name}</span>
            </Link>
          </Button>
        )
      })}
    </>
  )

  return (
    <nav className="sticky top-0 z-50 w-full border-b glass-effect">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <div className="absolute inset-0 gradient-primary rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-white dark:bg-gray-900 rounded-lg p-2">
                  <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-lg sm:text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  HR Dashboard
                </span>
                <div className="text-xs text-muted-foreground hidden lg:block">
                  <span className="font-semibold text-orange-500">Advanced</span> Professional Edition
                </div>
              </div>
              <div className="sm:hidden">
                <span className="font-bold text-base bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  HR
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1 ml-8">
              <NavItems />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* System Status - Hidden on small screens */}
            <div className="hidden xl:flex items-center space-x-2 text-sm text-muted-foreground mr-4">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>System Online</span>
            </div>

            {/* Theme Toggle */}
            <ModeToggle />

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between pb-6 border-b">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="absolute inset-0 gradient-primary rounded-lg blur opacity-75"></div>
                        <div className="relative bg-white dark:bg-gray-900 rounded-lg p-2">
                          <Building2 className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <div>
                        <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          HR Dashboard
                        </span>
                        <div className="text-xs text-muted-foreground">
                          <span className="font-semibold text-orange-500">Advanced</span> Professional Edition
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Navigation */}
                  <div className="flex flex-col space-y-2 py-6 flex-1">
                    <NavItems mobile onItemClick={() => setIsOpen(false)} />
                  </div>

                  {/* Mobile Footer */}
                  <div className="border-t pt-6 mt-auto">
                    <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>System Online</span>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
