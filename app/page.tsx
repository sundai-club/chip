import { TaskCard } from "@/components/task-card"
import { TaskFilter } from "@/components/task-filter"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#3D1766]">TaskShare</h1>
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
            <h2 className="text-2xl font-bold">Tasks</h2>
            <div className="relative">
              <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-gray-500" />
              <Input type="search" placeholder="Search tasks..." className="pl-10 w-full md:w-[300px]" />
            </div>
          </div>

          <TaskFilter />

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {mockTasks.map((task, index) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

// Mock data for demonstration
const mockTasks = [
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
    status: "Pledged",
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
    status: "New",
    contributors: 8,
    category: "Entertainment",
    imageUrl: `/animations/animation-6.svg`,
  },
]

