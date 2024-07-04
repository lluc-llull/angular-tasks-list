import { Injectable } from '@angular/core';
import { Task } from '../interfaces/task.interface';
import {BehaviorSubject, map, Observable} from 'rxjs';

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

  getTasks() {
    return this.tasks;
  }

  deleteTask(task: Task) {
    const index = this.tasks.findIndex(t => t.id === task.id);
    this.tasks.splice(index, 1);
    this.tasksSubject.next(this.tasks);
  }

  generateUniqueId(): number {
    const random = Math.floor(Math.random() * 10000);
    return parseInt(random.toString().padStart(4, '0'), 10);
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

  getTasksByPriority(priorityName: string): Observable<Task[]> {
    return this.tasksSubject.asObservable().pipe(
      map(tasks => tasks.filter(task => task.priority.name === priorityName))
    );
  }

  getTasksByMonth(): Observable<Task[]> {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth()+1;
    const currentYear = currentDate.getFullYear();

    return this.tasksSubject.pipe(
      map(tasks =>
        tasks.filter(task => {
          const taskDate = new Date(task.createdAt);
          return taskDate.getMonth() === currentMonth && taskDate.getFullYear() === currentYear;
        })
      )
    );
  }
}
