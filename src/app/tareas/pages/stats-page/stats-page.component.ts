import { Component, OnInit, Pipe } from '@angular/core';
import { Task } from '../../interfaces/task.interface';
import { TasksService } from '../../services/tasks.service';
import { StatusPipe } from '../../pipes/status.pipe';
import { Observable, Subscription, filter, map, of, subscribeOn, switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-page',
  standalone: true,
  imports: [CommonModule, StatusPipe],
  templateUrl: './stats-page.component.html',
  styleUrl: './stats-page.component.css'
})
export class StatsPageComponent implements OnInit{
  tasksList$!: Observable<Task[]>;
  tasksListCompleted$!: Observable<Task[]>;
  tasksListPending$!: Observable<Task[]>;
  private tasksSubscription: Subscription = new Subscription();

  constructor(private taskService: TasksService){ }

  ngOnInit(): void {
    //this.refreshTasksList();

    this.tasksList$ = this.taskService.getTasksObservable().pipe(
      switchMap(tasks => {
        this.tasksListCompleted$ = of(tasks.filter(task => task.completed));
        this.tasksListPending$ = of(tasks.filter(task => !task.completed));
        return of(tasks);
      })
    );
  }

  ngOnDestroy(): void {
    this.tasksSubscription.unsubscribe();
  }

  refreshTasksList(): void {
    // this.taskService.getTasksObservable().pipe(
    //   tap(tasks => {
    //     this.tasksList$ = of(tasks);
    //   })
    // ).subscribe();
  }

  private _sortColumn: string = '';
  private _sortDirection: 'asc' | 'desc' = 'asc';

  get getSortDirection(): string {
    return this._sortDirection;
  }

  get getSortColumn(): string {
    return this._sortColumn;
  }

  sortData(column: string): void {
    if (column === this.getSortColumn) {
      this._sortDirection = this._sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this._sortColumn = column;
      this._sortDirection = 'asc';
    }

    this.tasksList$ = this.tasksList$.pipe(
      map(tasks => {
        return tasks.sort((a, b) => {
          const aValue = this.getValue(a, this.getSortColumn);
          const bValue = this.getValue(b, this.getSortColumn);

          if (aValue < bValue) {
            return this.getSortDirection === 'asc' ? -1 : 1;
          } else if (aValue > bValue) {
            return this.getSortDirection === 'asc' ? 1 : -1;
          } else {
            return 0;
          }
        });
      })
    );
  }


  getValue(item: any, column: string): any {
    if (column === 'completed') {
      return item[column] ? 1 : 0;
    }
    return item[column];
  }
}
