import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CalendarIcon} from "lucide-react"
import FullCalendar from "@fullcalendar/react"
import { EventSourceInput } from "@fullcalendar/core/index.js"
import dayGridPlugin from "@fullcalendar/daygrid"

import { getAllTasks } from "../db"
import { categories, categoryColors } from "../utils"


export default function Calender() {
    const processAndSetTask = async () => {
        const processedTask: EventSourceInput = []
        const tasks = await getAllTasks()
        if (tasks){
            tasks.forEach(task => {
                processedTask?.push({
                    id: task.id.toString(),
                    title: task.description,
                    start: task.dueDate,
                    backgroundColor: "white",
                    borderColor: categoryColors[task.category as keyof typeof categoryColors],
                    textColor: categoryColors[task.category as keyof typeof categoryColors],
                })
            })
        }
        return processedTask
    }

    return (
        <Dialog>
        <DialogTrigger asChild>
            <Button variant="outline"><CalendarIcon /></Button>
        </DialogTrigger>
        <DialogContent className="lg:max-w-[900px]">
            <DialogHeader>
            <DialogTitle>Calender</DialogTitle>
            <DialogDescription>
                Calender View
            </DialogDescription>
            </DialogHeader>
            <FullCalendar
                plugins={[dayGridPlugin]}
                headerToolbar={{
                    left: "prev,next",
                    center: "title",
                    right:"today"
                }}
                initialView="dayGridMonth"
                initialEvents={processAndSetTask}
            />
            <div className="flex flex-wrap gap-4">
                {
                    categories.map((category) => (
                        <div className="flex flex-row gap-1 items-center" key={category}>
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: categoryColors[category as keyof typeof categoryColors] }}></div>
                            <div>{category}</div>
                        </div>
                    ))
                }
            </div>
        </DialogContent>
        </Dialog>
    );
}