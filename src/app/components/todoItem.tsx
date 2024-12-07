"use client"

import { Button } from "@/components/ui/button";
import { CheckCheck, CircleCheckBig, Pencil, Trash2 } from "lucide-react";
import { Task } from "../type";
import { deleteTask, getTasks, setTaskCompleted } from "../db";
import EditTodo from "./editTodo";
import { categoryColors } from "../utils";

export default function TodoItem({ setTaskCallBack, task, pageSize, page, filter, sort, filterComplete }: { setTaskCallBack:(tasks: Task[]|null) => void, task: Task, pageSize:number, page:number, filter:string, sort:string|null, filterComplete:boolean|null }) {
    const handleCompleteTask = async () => {
        setTaskCompleted(task)
        async function fetchTasks() {
            const fetchedTasks = await getTasks(pageSize, page, filter, sort, filterComplete )
            setTaskCallBack(fetchedTasks)
        }
        fetchTasks()
    }

    const handleDeleteTask = async () => {
        deleteTask(task.id)
        async function fetchTasks() {
            const fetchedTasks = await getTasks(pageSize, page, filter, sort, filterComplete )
            setTaskCallBack(fetchedTasks)
        }
        fetchTasks()
    }

    return (
        <div className="flex flex-row justify-between items-center w-full border border-gray-300 p-4 mb-4 rounded-lg">
            <div className="flex flex-col max-w-[70%]">
                <div className="text-3xl font-bold">{task.description}</div>
                <div className="flex flex-row gap-6">
                    <div className="text-lg"> <span className="font-bold">due:</span> {task.dueDate}</div>
                    <div> 
                        <div 
                            style={{
                                borderColor: categoryColors[task.category as keyof typeof categoryColors],
                                color: categoryColors[task.category as keyof typeof categoryColors],
                              }}
                            className="border rounded-full pl-2 pr-2"
                        >
                            {task.category}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-row ml-auto gap-2">
                <Button type="button" className="bg-white text-red-500 border border-red-500 hover:bg-gray-100" onClick={handleDeleteTask}> <Trash2 /> </Button>
                {
                    task.isCompleted
                    ? <>
                        <EditTodo task={task} 
                            setTaskCallBack={setTaskCallBack} 
                            pageSize={pageSize} 
                            page={page} 
                            filter={filter} 
                            sort={sort} 
                            filterComplete={filterComplete} 
                            disabled={true} 
                        />
                        <Button className="bg-white text-green-600 shadow-none" disabled> <CheckCheck /> </Button>
                    </>
                    : <>
                        <EditTodo task={task} 
                            setTaskCallBack={setTaskCallBack} 
                            pageSize={pageSize} 
                            page={page} 
                            filter={filter} 
                            sort={sort} 
                            filterComplete={filterComplete} 
                            disabled={false} 
                        />
                        <Button type="button" className="bg-white text-gray-500 border hover:bg-gray-100" onClick={handleCompleteTask}> <CircleCheckBig /> </Button>
                    </>
                }
            </div>
        </div>
    );
}