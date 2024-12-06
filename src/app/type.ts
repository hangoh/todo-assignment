export interface Task {
    id: number;
    description: string;
    category: string;
    dueDate: Date | undefined;
    isCompleted: boolean;
}


