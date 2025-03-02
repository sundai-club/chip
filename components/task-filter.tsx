"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

export function TaskFilter() {
  const [activeTab, setActiveTab] = useState("all")

  return (
    <div className="flex flex-col gap-4">
      <div className="flex overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex gap-2">
          <FilterTab id="all" label="All" active={activeTab === "all"} onClick={setActiveTab} />
          <FilterTab id="contribute" label="To Contribute" active={activeTab === "contribute"} onClick={setActiveTab} />
          <FilterTab id="upcoming" label="Accepted/Upcoming" active={activeTab === "upcoming"} onClick={setActiveTab} />
          <FilterTab id="mytasks" label="My Tasks" active={activeTab === "mytasks"} onClick={setActiveTab} />
          <FilterTab id="completed" label="Completed" active={activeTab === "completed"} onClick={setActiveTab} />
          <FilterTab id="closed" label="Closed" active={activeTab === "closed"} onClick={setActiveTab} />
        </div>
      </div>

      <div className="flex justify-between">
        <div className="flex gap-2">
          <SortDropdown />
          <CategoryDropdown />
        </div>
      </div>
    </div>
  )
}

interface FilterTabProps {
  id: string
  label: string
  active: boolean
  onClick: (id: string) => void
}

function FilterTab({ id, label, active, onClick }: FilterTabProps) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
        active ? "bg-[#3D1766] text-white" : "bg-white text-gray-600 hover:bg-gray-100 border"
      }`}
    >
      {label}
    </button>
  )
}

function SortDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="text-sm">
          Sort by: Newest
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem>Newest</DropdownMenuItem>
        <DropdownMenuItem>Due Date (Nearest)</DropdownMenuItem>
        <DropdownMenuItem>Amount (Highest)</DropdownMenuItem>
        <DropdownMenuItem>Amount (Lowest)</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function CategoryDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="text-sm">
          Category: All
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem>All Categories</DropdownMenuItem>
        <DropdownMenuItem>Event</DropdownMenuItem>
        <DropdownMenuItem>Transportation</DropdownMenuItem>
        <DropdownMenuItem>Food</DropdownMenuItem>
        <DropdownMenuItem>Shopping</DropdownMenuItem>
        <DropdownMenuItem>Entertainment</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

