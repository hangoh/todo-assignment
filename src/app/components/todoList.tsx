"use client"

import { useEffect, useState } from "react";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

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

    const handleOnDragEnd = (result: {destination: {index: number} | null, source: {index: number}}) => {
        const { destination, source } = result;

        // If dropped outside the list, ignore
        if (!destination) {
            return;
        }

        // If dropped on the same position, ignore
        if (destination.index === source.index) {
            return;
        }

        // Reorder the tasks array based on the drag result
        const reorderedTasks = Array.from(tasks || []);
        const [removed] = reorderedTasks.splice(source.index, 1);
        reorderedTasks.splice(destination.index, 0, removed);

        // Call the callback with the new task order
        setTaskCallBack(reorderedTasks);
    };

    return (
        <div className="w-full">
            {
                tasks
                ? <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="task-list">
                        {(provided) => (
                            <div
                                className="w-full"
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                            {tasks && (
                                tasks.map((task, index) => (
                                <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                    {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className="w-full"
                                    >
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
                                    )}
                                </Draggable>
                                ))
                            )}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
                : <h1 className="text-2xl font-bold mb-5 w-full flex flex-row justify-center items-center">
                    <span>No Task Has Been Created</span>
                </h1>
            }
        </div>
    );
}