import { Task } from "./type";

function connectdb() {
    const request = indexedDB.open("TodoTask", 1); 
    request.onupgradeneeded = function(event:IDBVersionChangeEvent) {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains("tasks")) {
            const store = db.createObjectStore("tasks", { keyPath: "id" });
            store.createIndex('dueDateIndex', 'dueDate');
        }
    };
    return request
}

export const addTask = (task: Task) => {
    const db = connectdb()

    db.onsuccess = (event: Event) => {
        const db = (event.target as IDBOpenDBRequest).result
        const transaction = db.transaction(["tasks"], "readwrite")
        const objectStore = transaction.objectStore("tasks")
        const store = objectStore.getAll();
        store.onsuccess = (event: Event) => {
            const all_tasks = (event.target as IDBRequest).result;
            task["id"] = all_tasks.length + 1
            objectStore.add(task)
        }
    }
}

export const getTasks = (size: number, page: number): Promise<Task[]|null> => {
    return new Promise((resolve, reject) => {
        const db = connectdb();

        db.onsuccess = (event: Event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            const transaction = db.transaction(["tasks"], "readonly");
            const objectStore = transaction.objectStore("tasks");

            const all_task = objectStore.getAll();

            all_task.onsuccess = (event: Event) => {
                const start_index = page * size;
                const advanced_tasks = (event.target as IDBRequest).result;

                try {
                    if (Array.isArray(advanced_tasks)) {
                        const tasks = advanced_tasks.slice(start_index, start_index + size)
                        if (tasks.length <= 0) {
                            resolve(null)
                        }
                        resolve(tasks); 
                    } else {
                        reject(new Error("No tasks found"));
                    }
                } catch (e) {
                    reject(e);
                }
            };
        };
    });
};