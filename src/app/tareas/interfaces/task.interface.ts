export interface Task {
  id: number;
  title: string;
  completed: boolean;
  priority: Priority;
  createdAt: Date;
  dueDate: Date;
  description: string;
}

export interface Priority {
  id: number;
  name: string;
}

export interface Status {
  id: number;
  name: string;
}
