"use client"

import { useEffect, useState } from "react"
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
import { CalendarIcon, Pencil, Plus } from "lucide-react"
import { format } from "date-fns"

import { getTasks, updateTask } from "../db"
import { Task } from "../type"


export default function EditTodo({ setTaskCallBack, task, pageSize, page, disabled, filter, sort, filterComplete }: { setTaskCallBack:(tasks: Task[]|null) => void, task:Task, pageSize:number, page:number, filter:string, sort:string|null, filterComplete:boolean|null, disabled:boolean }) {
  const [dateValue, setDate] = useState<Date>(new Date(task.dueDate))
  const [descriptionValue, setDesriptionValue] = useState<string>(task.description)
  const [categoryValue, setCategoryValue] = useState<string>(task.category)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setDesriptionValue(task.description)
    setCategoryValue(task.category)
    setDate(new Date(task.dueDate))
  }, [open])

  const handleTaskCreate = () => {
    updateTask(task.id, {
      id: task.id,
      description: descriptionValue,
      category: categoryValue,
      dueDate: format(dateValue, 'yyyy-MM-dd'),
      isCompleted: task.isCompleted,
    })
    async function fetchTasks() {
        const fetchedTasks = await getTasks(pageSize, page, filter, sort, filterComplete )
        setTaskCallBack(fetchedTasks)
    }
    fetchTasks()
    handleDialogClose()
  }

  const handleDialogClose = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {
            disabled
            ?<Button variant="outline" className="bg-white text-black border hover:bg-gray-100" disabled> <Pencil /></Button>
            : <Button variant="outline" className="bg-white text-black border hover:bg-gray-100"> <Pencil /></Button>
        }
      </DialogTrigger>
      <DialogContent className="lg:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Edit your to do task
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
                    onSelect={(e)=> e?setDate(e):setDate(new Date())}
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
          <Button type="submit" onClick={handleTaskCreate}>Update Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}