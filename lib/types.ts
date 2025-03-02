// Moving types to a separate file for better organization
export type TaskStatus = "New" | "Pledged" | "Accepted" | "Completed" | "Closed"
export type TaskCategory = "Event" | "Transportation" | "Food" | "Shopping" | "Entertainment" | "Other"

export interface Task {
  id: number
  title: string
  description: string
  dueDate: string
  pledgeAmount: number
  goalAmount: number
  status: TaskStatus
  contributors: number
  category: TaskCategory
  imageUrl?: string
}

export type FilterTab = "all" | "contribute" | "upcoming" | "mytasks" | "completed" | "closed"
export type SortOption = "newest" | "dueDate" | "amountHighest" | "amountLowest"

