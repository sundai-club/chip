"use client"

import { TaskCard } from "@/components/task-card"
import { TaskFilter } from "@/components/task-filter"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import type { Task, FilterTab, SortOption, TaskCategory } from "@/lib/types"
import { Logo } from "@/components/logo"

// Mock data
const mockTasks: Task[] = [
  {
    id: 1,
    title: "Organize Birthday Party",
    description: "Need help planning a surprise birthday party for 20 people",
    dueDate: "2023-12-15",
    pledgeAmount: 120,
    goalAmount: 200,
    status: "New",
    contributors: 3,
    category: "Event",
    imageUrl: `/animations/animation-1.svg`,
  },
  {
    id: 2,
    title: "Airport Pickup",
    description: "Need someone to pick up my parents from the airport",
    dueDate: "2023-11-30",
    pledgeAmount: 75,
    goalAmount: 75,
    status: "Pledged",
    contributors: 2,
    category: "Transportation",
    imageUrl: `/animations/animation-2.svg`,
  },
  {
    id: 3,
    title: "Catering for Office Party",
    description: "Looking for someone to arrange catering for 30 people",
    dueDate: "2023-12-20",
    pledgeAmount: 350,
    goalAmount: 500,
    status: "Accepted",
    contributors: 5,
    category: "Food",
    imageUrl: `/animations/animation-3.svg`,
  },
  {
    id: 4,
    title: "Holiday Decoration Setup",
    description: "Need help setting up holiday decorations for a house party",
    dueDate: "2023-12-10",
    pledgeAmount: 180,
    goalAmount: 200,
    status: "New",
    contributors: 4,
    category: "Event",
    imageUrl: `/animations/animation-4.svg`,
  },
  {
    id: 5,
    title: "Group Gift Shopping",
    description: "Need someone to purchase and wrap a group gift",
    dueDate: "2023-12-18",
    pledgeAmount: 250,
    goalAmount: 250,
    status: "Completed",
    contributors: 6,
    category: "Shopping",
    imageUrl: `/animations/animation-5.svg`,
  },
  {
    id: 6,
    title: "DJ for New Year's Party",
    description: "Looking for a DJ for our New Year's Eve party",
    dueDate: "2023-12-31",
    pledgeAmount: 400,
    goalAmount: 600,
    status: "Closed",
    contributors: 8,
    category: "Entertainment",
    imageUrl: `/animations/animation-6.svg`,
  },
]

export default function Dashboard() {
  const [tasks] = useState<Task[]>(mockTasks)
  const [activeTab, setActiveTab] = useState<FilterTab>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("newest")
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | "all">("all")

  // Filter tasks based on active tab
  const filterTasksByTab = (tasks: Task[]): Task[] => {
    switch (activeTab) {
      case "contribute":
        return tasks.filter((task) => task.status === "New" || task.status === "Pledged")
      case "upcoming":
        return tasks.filter((task) => task.status === "Accepted")
      case "mytasks":
        return tasks.filter((task) => task.contributors > 0)
      case "completed":
        return tasks.filter((task) => task.status === "Completed")
      case "closed":
        return tasks.filter((task) => task.status === "Closed")
      default:
        return tasks
    }
  }

  // Filter tasks based on search query
  const filterTasksBySearch = (tasks: Task[]): Task[] => {
    if (!searchQuery) return tasks
    const query = searchQuery.toLowerCase()
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.category.toLowerCase().includes(query),
    )
  }

  // Filter tasks by category
  const filterTasksByCategory = (tasks: Task[]): Task[] => {
    if (selectedCategory === "all") return tasks
    return tasks.filter((task) => task.category === selectedCategory)
  }

  // Sort tasks
  const sortTasks = (tasks: Task[]): Task[] => {
    switch (sortBy) {
      case "dueDate":
        return [...tasks].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      case "amountHighest":
        return [...tasks].sort((a, b) => b.goalAmount - a.goalAmount)
      case "amountLowest":
        return [...tasks].sort((a, b) => a.goalAmount - b.goalAmount)
      case "newest":
      default:
        return [...tasks].sort((a, b) => b.id - a.id)
    }
  }

  // Apply all filters and sorting
  const filteredTasks = sortTasks(filterTasksByCategory(filterTasksBySearch(filterTasksByTab(tasks))))

  console.log("Initial tasks:", tasks)
  console.log("Filtered tasks:", filteredTasks)
  console.log("Active tab:", activeTab)
  console.log("Selected category:", selectedCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto">
          <div className="flex items-center gap-2">
            <Logo />
          </div>
          <div className="flex items-center gap-4">
            <Link href="/create">
              <Button className="bg-[#7B2869] hover:bg-[#3D1766]">
                <Plus className="w-4 h-4 mr-2" />
                Create Task
              </Button>
            </Link>
            <div className="w-8 h-8 rounded-full bg-[#3D1766] text-white flex items-center justify-center">JS</div>
          </div>
        </div>
      </header>

      <main className="container px-4 py-6 mx-auto">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-2xl font-bold text-white">Tasks</h2>
            <div className="relative">
              <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-gray-500" />
              <Input
                type="search"
                placeholder="Search tasks..."
                className="pl-10 w-full md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <TaskFilter
            activeTab={activeTab}
            onTabChange={setActiveTab}
            sortBy={sortBy}
            onSortChange={setSortBy}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white text-lg">No tasks found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

