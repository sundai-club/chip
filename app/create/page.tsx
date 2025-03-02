"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import { Logo } from "@/components/logo"

export default function CreateTaskPage() {
  const [step, setStep] = useState(1)
  const [date, setDate] = useState<Date>()

  const nextStep = () => {
    if (step < 5) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Logo />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-[#3D1766] text-white flex items-center justify-center">JS</div>
          </div>
        </div>
      </header>

      <main className="container px-4 py-6 mx-auto">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Link href="/" className="text-[#7B2869] hover:underline">
              ← Back to tasks
            </Link>
          </div>

          <Card className="bg-white/95 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <h1 className="text-2xl font-bold">Create a New Task</h1>
              <div className="flex items-center justify-between mt-4">
                <StepIndicator currentStep={step} totalSteps={5} />
              </div>
            </CardHeader>
            <CardContent>
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Basic Information</h2>
                  <div className="space-y-2">
                    <Label htmlFor="title">Task Title</Label>
                    <Input id="title" placeholder="Enter a clear, descriptive title" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Describe what needs to be done in detail" rows={4} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="event">Event</SelectItem>
                        <SelectItem value="transportation">Transportation</SelectItem>
                        <SelectItem value="food">Food</SelectItem>
                        <SelectItem value="shopping">Shopping</SelectItem>
                        <SelectItem value="entertainment">Entertainment</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Timeline</h2>
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Select a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estimatedTime">Estimated Completion Time (hours)</Label>
                    <Input id="estimatedTime" type="number" min="0.5" step="0.5" placeholder="e.g., 2.5" />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Financial Details</h2>
                  <div className="space-y-2">
                    <Label htmlFor="goalAmount">Minimum Pledge Goal ($)</Label>
                    <Input id="goalAmount" type="number" min="1" placeholder="e.g., 100" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="suggestedPledge">Suggested Individual Pledge Amount ($)</Label>
                    <Input id="suggestedPledge" type="number" min="1" placeholder="e.g., 20" />
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      Setting a reasonable goal increases the chances of your task being funded. The suggested
                      individual pledge helps contributors know how much to contribute.
                    </p>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Privacy Settings</h2>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <input type="radio" id="privacy-friends" name="privacy" className="mt-1" defaultChecked />
                      <div>
                        <Label htmlFor="privacy-friends" className="font-medium">
                          Friends Only
                        </Label>
                        <p className="text-sm text-gray-500">Only your friends can see and contribute to this task</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <input type="radio" id="privacy-network" name="privacy" className="mt-1" />
                      <div>
                        <Label htmlFor="privacy-network" className="font-medium">
                          Network
                        </Label>
                        <p className="text-sm text-gray-500">Friends of friends can also see and contribute</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <input type="radio" id="privacy-public" name="privacy" className="mt-1" />
                      <div>
                        <Label htmlFor="privacy-public" className="font-medium">
                          Public
                        </Label>
                        <p className="text-sm text-gray-500">Anyone on TaskShare can see and contribute</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Review and Submit</h2>
                  <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                    <div>
                      <span className="font-medium">Title:</span> Organize Birthday Party
                    </div>
                    <div>
                      <span className="font-medium">Category:</span> Event
                    </div>
                    <div>
                      <span className="font-medium">Due Date:</span> {date ? format(date, "PPP") : "Not set"}
                    </div>
                    <div>
                      <span className="font-medium">Pledge Goal:</span> $200
                    </div>
                    <div>
                      <span className="font-medium">Suggested Pledge:</span> $40
                    </div>
                    <div>
                      <span className="font-medium">Privacy:</span> Friends Only
                    </div>
                    <div>
                      <span className="font-medium">Description:</span>
                      <p className="text-sm text-gray-600 mt-1">
                        Need help planning a surprise birthday party for 20 people. This includes decorations, cake
                        ordering, and coordinating with the venue.
                      </p>
                    </div>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-800">
                      By submitting this task, you agree to our Terms of Service and understand that TaskShare will hold
                      pledged funds in escrow until the task is completed.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              {step > 1 ? (
                <Button variant="outline" onClick={prevStep}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              ) : (
                <Link href="/">
                  <Button variant="outline">Cancel</Button>
                </Link>
              )}

              {step < 5 ? (
                <Button onClick={nextStep} className="bg-[#7B2869] hover:bg-[#3D1766]">
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Link href="/">
                  <Button className="bg-[#7B2869] hover:bg-[#3D1766]">Create Task</Button>
                </Link>
              )}
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
}

function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center w-full gap-2">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={`h-2 rounded-full flex-1 ${index + 1 <= currentStep ? "bg-[#7B2869]" : "bg-gray-200"}`}
        />
      ))}
    </div>
  )
}

