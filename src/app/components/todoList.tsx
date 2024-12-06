import { Task } from "../type";

export default function TodoList({ tasks }: { tasks: Task[] | null }) {
    return (
        <div>
            {   
                tasks
                ? tasks.map(task => (
                    <div key={task.id}>
                        {task.description}
                    </div>
                ))
                : <h1 className="text-2xl font-bold mb-5">No Task Has Been Created</h1>
            }
        </div>
    );
}