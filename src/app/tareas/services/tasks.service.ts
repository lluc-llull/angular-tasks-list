import { Injectable } from '@angular/core';
import { Task } from '../interfaces/task.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private tasks: Task[] = [];
  private tasksSubject = new BehaviorSubject<Task[]>([]);

  constructor() { }

  addTask(task: Task): void {
    task.id = this.generateUniqueId();
    this.tasks.push(task);
    this.tasksSubject.next(this.tasks);
  }

  getTasks(): Task[] {
    return this.tasks;
  }

  deleteTask(task: Task) {
    const index = this.tasks.findIndex(t => t.id === task.id);
    this.tasks.splice(index, 1);
    this.tasksSubject.next(this.tasks);
  }

  generateUniqueId(): number {
    const timestamp = new Date().getTime();
    const shortenedTimestamp = timestamp.toString().substr(-5);
    const random = Math.floor(Math.random() * 100);
    const uniqueId = parseInt('1' + shortenedTimestamp + random.toString().padStart(2, '0'), 10);
    return uniqueId;
  }

  updateTask(updatedTask: Task): void {
    const index = this.tasks.findIndex(t => t.id === updatedTask.id);
    if (index !== -1) {
      this.tasks[index] = updatedTask;
      this.tasksSubject.next(this.tasks);
    }
  }

  getTasksObservable(): Observable<Task[]> {
    return this.tasksSubject.asObservable();
  }

  getTaskById(id: number): Observable<Task | undefined> {
    return new Observable<Task | undefined>((observer) => {
      const task = this.tasks.find(t => t.id === id);
      observer.next(task);
      observer.complete();
    });
  }
}
