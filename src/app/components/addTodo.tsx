"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { categories } from "../utils"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { addTask, getTasks } from "../db"
import { Task } from "../type"


export default function AddTodo({ setTaskCallBack, pageSize, page }: { setTaskCallBack:(tasks: Task[]|null) => void, pageSize:number, page:number }) {
  const [dateValue, setDate] = useState<Date | undefined>(new Date())
  const [descriptionValue, setDesriptionValue] = useState<string>("")
  const [categoryValue, setCategoryValue] = useState<string>("Personal")
  const [open, setOpen] = useState(false)

  const handleTaskCreate = () => {
    addTask({
      id: 0,
      description: descriptionValue,
      category: categoryValue,
      dueDate: dateValue,
      isCompleted: false,
    })
    async function fetchTasks() {
        const fetchedTasks = await getTasks(pageSize, page)
        setTaskCallBack(fetchedTasks)
    }
    fetchTasks()
    handleDialogClose()
  }

  const handleDialogOpen = () => {
    setOpen(true)
  }
  const handleDialogClose = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Task</Button>
      </DialogTrigger>
      <DialogContent className="lg:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Add Task</DialogTitle>
          <DialogDescription>
            Add new to do task
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="description" className="text-left">
              Description
            </Label>
            <Textarea 
              id="description"
              defaultValue={descriptionValue}
              onChange={(e) => setDesriptionValue(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="category" className="text-left">
              Category
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" >{categoryValue}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-80"
                isInsideDialog={true}
              >
                <DropdownMenuLabel>Category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <ScrollArea className="h-96">
                  <DropdownMenuRadioGroup 
                    value={categoryValue} 
                    onValueChange={setCategoryValue}
                  >
                      {categories.map((category) => (
                        <DropdownMenuRadioItem key={category} value={category}>
                          {category}
                        </DropdownMenuRadioItem>
                      ))}
                  </DropdownMenuRadioGroup>
                </ScrollArea>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="duedate" className="text-left">
              Task due date
            </Label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-[240px] pl-3 text-left font-normal"
                    >
                      {dateValue ? (
                        format(dateValue, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateValue}
                    onSelect={(e)=> setDate(e)}
                    disabled={(date) =>
                      date < new Date()
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleTaskCreate}>Create Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

}