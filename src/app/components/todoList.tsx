"use client"

import { useEffect, useState } from "react";
import { Task } from "../type";
import TodoItem from "./todoItem";

export default function TodoList({ setTaskCallBack, tasks, pageSize, page, filter, sort, filterComplete }: { setTaskCallBack:(tasks: Task[]|null) => void, tasks: Task[]|null, pageSize:number, page:number, filter:string, sort:string|null, filterComplete:boolean|null }) {
    const [isClient, setIsClient] = useState(false)
 
    useEffect(() => {
        setIsClient(true)
    }, [])

    if (!isClient) {
        return
    }

    return (
        <div className="w-full">
            {
                tasks
                ? tasks.map(task => (
                    <div key={task.id} className="w-full">
                        <TodoItem 
                            setTaskCallBack={setTaskCallBack} 
                            task={task} 
                            pageSize={pageSize} 
                            page={page} 
                            filter={filter} 
                            sort={sort} 
                            filterComplete={filterComplete}
                        />
                    </div>
                ))
                : <h1 className="text-2xl font-bold mb-5 w-full">No Task Has Been Created</h1>
            }
        </div>
    );
}