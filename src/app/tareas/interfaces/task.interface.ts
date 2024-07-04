export interface Task {
  id: number;
  title: string;
  status: Status;
  priority: Priority;
  createdAt: Date;
  dueDate: Date;
  description: string;
}

export interface Priority {
  id: number;
  name: string;
  color: string;
}

export interface Status {
  id: number;
  name: string;
  color: string;
}


