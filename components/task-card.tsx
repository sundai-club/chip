import { Calendar, Users } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Task } from "@/lib/types"

interface TaskCardProps {
  task: Task
}

export function TaskCard({ task }: TaskCardProps) {
  const daysLeft = getDaysLeft(task.dueDate)
  const progressPercentage = (task.pledgeAmount / task.goalAmount) * 100

  console.log("Rendering TaskCard:", task)

  return (
    <Link href={`/tasks/${task.id}`}>
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg bg-white/90 backdrop-blur-sm border-0">
        <CardHeader className="p-4 pb-0">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold line-clamp-1">{task.title}</h3>
              <p className="text-sm text-gray-500">{task.category}</p>
            </div>
            <StatusBadge status={task.status} />
          </div>
        </CardHeader>
        <div className="w-full h-40 overflow-hidden">
          <img
            src={task.imageUrl || `/animations/animation-${task.id}.svg`}
            alt={`${task.title} illustration`}
            className="w-full h-full object-cover"
          />
        </div>
        <CardContent className="p-4">
          <p className="mb-4 text-sm text-gray-600 line-clamp-2">{task.description}</p>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-500">Pledged</span>
              <span className="text-sm font-medium">
                ${task.pledgeAmount} of ${task.goalAmount}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>{daysLeft > 0 ? `${daysLeft} days left` : "Due today"}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Users className="w-4 h-4 text-gray-400" />
              <span>{task.contributors} contributors</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 border-t">
          <div className="flex items-center justify-between w-full">
            <div className="text-lg font-semibold text-[#3D1766]">${task.pledgeAmount}</div>
            <ActionButton status={task.status} />
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "New":
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">New</Badge>
    case "Pledged":
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Pledged</Badge>
    case "Accepted":
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Accepted</Badge>
    case "Completed":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
    case "Closed":
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Closed</Badge>
    default:
      return null
  }
}

function ActionButton({ status }: { status: string }) {
  switch (status) {
    case "New":
    case "Pledged":
      return (
        <Button
          size="sm"
          variant="outline"
          className="text-[#7B2869] border-[#7B2869] hover:bg-[#7B2869] hover:text-white"
        >
          Pledge
        </Button>
      )
    case "Accepted":
      return (
        <Button size="sm" variant="outline" disabled>
          Accepted
        </Button>
      )
    case "Completed":
      return (
        <Button size="sm" variant="outline" disabled>
          Completed
        </Button>
      )
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

