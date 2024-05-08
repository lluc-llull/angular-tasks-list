import { Injectable } from '@angular/core';
import { Task } from '../interfaces/task.interface';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private tasks: Task[] = [];

  constructor() { }

  addTask(task: Task): void {
    task.id = this.tasks.length + 1;
    this.tasks.push(task);
  }

  getTasks(): Task[] {
    return this.tasks;
  }
}
