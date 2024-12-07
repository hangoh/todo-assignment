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
            task["id"] = (all_tasks.length + 1)
            objectStore.add(task)
        }
    }
}

export const getTasks = (size: number, page: number, filter:string, sort:string|null , filterComplete:boolean|null): Promise<Task[]|null> => {
    return new Promise((resolve, reject) => {
        const db = connectdb();

        db.onsuccess = (event: Event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            const transaction = db.transaction(["tasks"], "readonly");
            const objectStore = transaction.objectStore("tasks");
            if (sort){
                const asc_tasks  = objectStore.index("dueDateIndex");

                const all_task = asc_tasks.getAll();
                all_task.onsuccess = (event: Event) => {
                    const start_index = page * size;
                    const advanced_tasks = (event.target as IDBRequest).result;
                    if (sort=="desc") {
                        advanced_tasks.reverse()
                    }
    
                    try {
                        if (Array.isArray(advanced_tasks)) {
                            if (advanced_tasks.length <= 0) {
                                resolve(null)
                            }
                            let tasks = advanced_tasks
                            if (filter!==""){
                                const filtered_tasks = advanced_tasks.filter((task: Task) => task.description.toLowerCase().includes(filter.toLowerCase()))
                                tasks = filtered_tasks
                            }
                            if (filterComplete!=null) {
                                const filtered_tasks = tasks.filter((task: Task) => task.isCompleted == filterComplete)
                                tasks = filtered_tasks
                            }
                            resolve(tasks.slice(start_index, start_index + size));
                        } else {
                            reject(new Error("No tasks found"));
                        }
                    } catch (e) {
                        reject(e);
                    }
                };
                
            } else {
                const all_task = objectStore.getAll();
                all_task.onsuccess = (event: Event) => {
                    const start_index = page * size;
                    const advanced_tasks = (event.target as IDBRequest).result;
    
                    try {
                        if (Array.isArray(advanced_tasks)) {
                            if (advanced_tasks.length <= 0) {
                                resolve(null)
                            }
                            let tasks = advanced_tasks
                            if (filter!==""){
                                const filtered_tasks = advanced_tasks.filter((task: Task) => task.description.toLowerCase().includes(filter.toLowerCase()))
                                tasks = filtered_tasks
                            }
                            if (filterComplete!=null) {
                                const filtered_tasks = tasks.filter((task: Task) => task.isCompleted == filterComplete)
                                tasks = filtered_tasks
                            }
                            resolve(tasks.slice(start_index, start_index + size));
                        } else {
                            reject(new Error("No tasks found"));
                        }
                    } catch (e) {
                        reject(e);
                    }
                };
            }
        };
    });
};

export const getAllTasks = (): Promise<Task[]|null> => {
    return new Promise((resolve, reject) => {
        const db = connectdb();

        db.onsuccess = (event: Event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            const transaction = db.transaction(["tasks"], "readonly");
            const objectStore = transaction.objectStore("tasks");

            const all_task = objectStore.getAll();

            all_task.onsuccess = (event: Event) => {
                const tasks = (event.target as IDBRequest).result;

                try {
                    if (Array.isArray(tasks)) {
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

export const getTasksCount = (): Promise<number> => {
    return new Promise((resolve, reject) => {
        const db = connectdb();

        db.onsuccess = (event: Event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            const transaction = db.transaction(["tasks"], "readonly");
            const objectStore = transaction.objectStore("tasks");

            const countRequest = objectStore.count();

            countRequest.onsuccess = (event: Event) => {
                const count = (event.target as IDBRequest).result;

                resolve(count)
            };
        };
    });
};

export const setTaskCompleted = (task: Task) => {
    const db = connectdb()
    db.onsuccess = (event: Event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction(["tasks"], "readwrite");
        const objectStore = transaction.objectStore("tasks");

        const task_to_update = objectStore.get(task.id);
        task_to_update.onsuccess = (event: Event) => {
            const updated_task = (event.target as IDBRequest).result;
            updated_task.isCompleted = true;
            objectStore.put(updated_task);
        };
    };
}

export const updateTask = (id:number ,task: Task) => {
    const db = connectdb()
    db.onsuccess = (event: Event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction(["tasks"], "readwrite");
        const objectStore = transaction.objectStore("tasks");

        const task_to_update = objectStore.get(id);
        task_to_update.onsuccess = (event: Event) => {
            const updated_task = (event.target as IDBRequest).result;
            updated_task.description = task.description;
            updated_task.category = task.category;
            updated_task.dueDate = task.dueDate
            objectStore.put(updated_task);
        };
    };
}

export const deleteTask = (id:number) => {
    const db = connectdb()
    db.onsuccess = (event: Event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction(["tasks"], "readwrite");
        const objectStore = transaction.objectStore("tasks");

        const task_to_delete = objectStore.delete(id);
    };
}