import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TasksService } from '../../services/tasks.service';
import { Task } from '../../interfaces/task.interface';
import { StatusPipe } from '../../pipes/status.pipe';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list-page',
  standalone: true,
  imports: [RouterModule, StatusPipe],
  templateUrl: './list-page.component.html',
  styleUrl: './list-page.component.css'
})
export class ListPageComponent implements OnInit, OnDestroy {
  public tasksList: Task[] = [];
  private tasksSubscription: Subscription = new Subscription();

  constructor(private taskService: TasksService){ }

  ngOnInit(): void {
    this.tasksSubscription = this.taskService.getTasksObservable().subscribe(tasks => {
      this.tasksList = tasks;
    });
    this.refreshTasksList();
  }

  ngOnDestroy(): void {
    if (this.tasksSubscription) {
      this.tasksSubscription.unsubscribe();
    }
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

  deleteValue(task: Task) {
    this.taskService.deleteTask(task);
    this.refreshTasksList();
  }

  toggleCompleted(task: Task): void {
    task.completed = !task.completed;
    this.taskService.updateTask(task);
  }

}
