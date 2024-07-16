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
  svg: string;
}

export interface Status {
  id: number;
  name: string;
  color: string;
}


