import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Calendar, CheckCircle, Clock, DollarSign, Share2, Users } from "lucide-react"
import Link from "next/link"

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  // In a real app, we would fetch the task data based on the ID
  const task = mockTasks.find((t) => t.id === Number.parseInt(params.id)) || mockTasks[0]
  const progressPercentage = (task.pledgeAmount / task.goalAmount) * 100
  const daysLeft = getDaysLeft(task.dueDate)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto">
          <div className="flex items-center gap-2">
            <Link href="/">
              <h1 className="text-xl font-bold text-[#3D1766]">TaskShare</h1>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/create">
              <Button className="bg-[#7B2869] hover:bg-[#3D1766]">Create Task</Button>
            </Link>
            <div className="w-8 h-8 rounded-full bg-[#3D1766] text-white flex items-center justify-center">JS</div>
          </div>
        </div>
      </header>

      <main className="container px-4 py-6 mx-auto">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Link href="/" className="text-[#7B2869] hover:underline">
              ← Back to tasks
            </Link>
          </div>

          <div className="p-6 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between">
                  <h1 className="text-2xl font-bold">{task.title}</h1>
                  <StatusBadge status={task.status} />
                </div>
                <div className="w-full h-48 mt-4 mb-2 overflow-hidden rounded-lg">
                  <img
                    src={task.imageUrl || `/animations/animation-${params.id}.svg`}
                    alt={`${task.title} illustration`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-wrap gap-4 mt-2">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Due: {formatDate(task.dueDate)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{daysLeft > 0 ? `${daysLeft} days left` : "Due today"}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{task.contributors} contributors</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold">Description</h2>
                <p className="text-gray-700">{task.description}</p>
              </div>

              <Separator />

              <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold">Pledge Progress</h2>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Current pledges</span>
                    <span className="text-xl font-semibold">
                      ${task.pledgeAmount} of ${task.goalAmount}
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-3 mb-4" />
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">{task.contributors} contributors</span>
                    <span className="text-sm text-gray-500">{progressPercentage.toFixed(0)}% of goal</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold">Contributors</h2>
                <div className="space-y-3">
                  {mockContributors.map((contributor) => (
                    <div key={contributor.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                          {contributor.initials}
                        </div>
                        <span>{contributor.name}</span>
                      </div>
                      <span className="font-medium">${contributor.amount}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {task.status === "New" || task.status === "Pledged" ? (
                    <>
                      <Button size="lg" className="bg-[#7B2869] hover:bg-[#3D1766]">
                        <DollarSign className="w-4 h-4 mr-2" />
                        Pledge Money
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-[#7B2869] text-[#7B2869] hover:bg-[#7B2869] hover:text-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Accept Task
                      </Button>
                    </>
                  ) : task.status === "Accepted" ? (
                    <>
                      <Button size="lg" disabled>
                        Task Accepted
                      </Button>
                      <Button size="lg" variant="outline">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </>
                  ) : (
                    <Button size="lg" variant="outline">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "New":
      return <div className="px-3 py-1 text-sm font-medium bg-blue-100 rounded-full text-blue-800">New</div>
    case "Pledged":
      return <div className="px-3 py-1 text-sm font-medium bg-purple-100 rounded-full text-purple-800">Pledged</div>
    case "Accepted":
      return <div className="px-3 py-1 text-sm font-medium bg-amber-100 rounded-full text-amber-800">Accepted</div>
    case "Completed":
      return <div className="px-3 py-1 text-sm font-medium bg-green-100 rounded-full text-green-800">Completed</div>
    case "Closed":
      return <div className="px-3 py-1 text-sm font-medium bg-red-100 rounded-full text-red-800">Closed</div>
    default:
      return null
  }
}

function getDaysLeft(dueDate: string): number {
  const today = new Date()
  const due = new Date(dueDate)
  const diffTime = due.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" }
  return new Date(dateString).toLocaleDateString("en-US", options)
}

// Mock data for demonstration
const mockTasks = [
  {
    id: 1,
    title: "Organize Birthday Party",
    description:
      "Need help planning a surprise birthday party for 20 people. This includes decorations, cake ordering, and coordinating with the venue. The party is for my best friend who is turning 30, and I want to make it special. We already have a venue booked, but need someone to take charge of the overall planning and execution.",
    dueDate: "2023-12-15",
    pledgeAmount: 120,
    goalAmount: 200,
    status: "New",
    contributors: 3,
    category: "Event",
    imageUrl: "/images/birthday-party.jpg",
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
    imageUrl: "/images/airport-pickup.jpg",
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
    imageUrl: "/images/office-party.jpg",
  },
]

const mockContributors = [
  { id: 1, name: "Alex Johnson", initials: "AJ", amount: 50 },
  { id: 2, name: "Maria Garcia", initials: "MG", amount: 40 },
  { id: 3, name: "Sam Taylor", initials: "ST", amount: 30 },
]

