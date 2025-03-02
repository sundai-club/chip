"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { FilterTab, type SortOption, type TaskCategory } from "@/lib/types"

interface TaskFilterProps {
  activeTab: FilterTab
  onTabChange: (tab: FilterTab) => void
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
  selectedCategory: TaskCategory | "all"
  onCategoryChange: (category: TaskCategory | "all") => void
}

export function TaskFilter({
  activeTab,
  onTabChange,
  sortBy,
  onSortChange,
  selectedCategory,
  onCategoryChange,
}: TaskFilterProps) {
  const getSortLabel = (sort: SortOption): string => {
    switch (sort) {
      case "dueDate":
        return "Due Date (Nearest)"
      case "amountHighest":
        return "Amount (Highest)"
      case "amountLowest":
        return "Amount (Lowest)"
      case "newest":
        return "Newest"
      default:
        return "Sort by"
    }
  }

  const getCategoryLabel = (category: TaskCategory | "all"): string => {
    return category === "all" ? "All Categories" : category
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex gap-2">
          <FilterTab id="all" label="All" active={activeTab === "all"} onClick={() => onTabChange("all")} />
          <FilterTab
            id="contribute"
            label="To Contribute"
            active={activeTab === "contribute"}
            onClick={() => onTabChange("contribute")}
          />
          <FilterTab
            id="upcoming"
            label="Accepted/Upcoming"
            active={activeTab === "upcoming"}
            onClick={() => onTabChange("upcoming")}
          />
          <FilterTab
            id="mytasks"
            label="My Tasks"
            active={activeTab === "mytasks"}
            onClick={() => onTabChange("mytasks")}
          />
          <FilterTab
            id="completed"
            label="Completed"
            active={activeTab === "completed"}
            onClick={() => onTabChange("completed")}
          />
          <FilterTab id="closed" label="Closed" active={activeTab === "closed"} onClick={() => onTabChange("closed")} />
        </div>
      </div>

      <div className="flex justify-between">
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="text-sm bg-white">
                Sort by: {getSortLabel(sortBy)}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => onSortChange("newest")}>Newest</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSortChange("dueDate")}>Due Date (Nearest)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSortChange("amountHighest")}>Amount (Highest)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSortChange("amountLowest")}>Amount (Lowest)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="text-sm bg-white">
                Category: {getCategoryLabel(selectedCategory)}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => onCategoryChange("all")}>All Categories</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onCategoryChange("Event")}>Event</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onCategoryChange("Transportation")}>Transportation</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onCategoryChange("Food")}>Food</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onCategoryChange("Shopping")}>Shopping</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onCategoryChange("Entertainment")}>Entertainment</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onCategoryChange("Other")}>Other</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

interface FilterTabProps {
  id: string
  label: string
  active: boolean
  onClick: () => void
}

function FilterTab({ id, label, active, onClick }: FilterTabProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
        active
          ? "bg-[#3D1766] text-white"
          : "bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-gray-900 border"
      }`}
    >
      {label}
    </button>
  )
}

