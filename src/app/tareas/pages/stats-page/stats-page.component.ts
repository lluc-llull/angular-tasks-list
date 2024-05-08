import { Component, OnInit } from '@angular/core';
import { Task } from '../../interfaces/task.interface';
import { TasksService } from '../../services/tasks.service';
import { StatusPipe } from '../../pipes/status.pipe';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-stats-page',
  standalone: true,
  imports: [StatusPipe],
  templateUrl: './stats-page.component.html',
  styleUrl: './stats-page.component.css'
})
export class StatsPageComponent implements OnInit{
  public tasksList: Task[] = [];
  public tasksListCompleted: Task[] = [];
  public tasksListPending: Task[] = [];
  private tasksSubscription: Subscription = new Subscription();

  constructor(private taskService: TasksService){ }

  ngOnInit(): void {
    this.refreshTasksList();

    this.tasksSubscription = this.taskService.getTasksObservable().subscribe(tasks => {
      this.tasksListCompleted = tasks.filter(task => task.completed);
    });

    this.tasksSubscription = this.taskService.getTasksObservable().subscribe(tasks => {
      this.tasksListPending = tasks.filter(task => !task.completed);
    });
  }

  ngOnDestroy(): void {
    this.tasksSubscription.unsubscribe();
  }

  refreshTasksList(): void {
    //this.tasksList = JSON.parse(localStorage.getItem('tasks') || '[]');
    this.tasksList = this.taskService.getTasks();
  }

  public sortColumn: string = '';
  public sortDirection: 'asc' | 'desc' = 'asc';

  sortData(column: string): void {
    if (column === this.sortColumn) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.tasksList.sort((a, b) => {
      const aValue = this.getValue(a, this.sortColumn);
      const bValue = this.getValue(b, this.sortColumn);

      if (aValue < bValue) {
        return this.sortDirection === 'asc' ? -1 : 1;
      } else if (aValue > bValue) {
        return this.sortDirection === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });
  }

  getValue(item: any, column: string): any {
    if (column === 'completed') {
      return item[column] ? 1 : 0;
    }
    return item[column];
  }
}
