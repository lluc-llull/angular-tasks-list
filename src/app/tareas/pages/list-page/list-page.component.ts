import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TasksService } from '../../services/tasks.service';
import { Task } from '../../interfaces/task.interface';
import { StatusPipe } from '../../pipes/status.pipe';
import { Observable, Subscription, map, of, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import {ModalActionsComponent} from "../../components/modal-actions/modal-actions.component";

@Component({
  selector: 'app-list-page',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusPipe, ModalActionsComponent],
  templateUrl: './list-page.component.html',
  styleUrl: './list-page.component.css'
})
export class ListPageComponent implements OnInit, OnDestroy {
  modalOpen = false;

  openModal() {
    this.modalOpen = true;
  }
  handleClose() {
    this.modalOpen = false;
  }

  tasksList$!: Observable<Task[]>;
  private tasksSubscription: Subscription = new Subscription();

  constructor(private taskService: TasksService, private router: Router){ }

  ngOnInit(): void {
    this.tasksList$ = this.taskService.getTasksObservable().pipe(
      tap(tasks => {
        this.tasksList$ = of(tasks);
      })
    );
    // this.refreshTasksList();
  }

  ngOnDestroy(): void {
    this.tasksSubscription.unsubscribe();
  }

  refreshTasksList(): void {
    // this.tasksList = this.taskService.getTasks();
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
    if (column === 'status') {
      return item[column] ? 1 : 0;
    }
    return item[column];
  }

  deleteValue(task: Task) {
    this.taskService.deleteTask(task);
    this.refreshTasksList();
  }

  togglestatus(task: Task): void {
    // task.status = !task.status;
    // this.taskService.updateTask(task);
  }

  navigateToTask(taskId: number) {
    this.router.navigate(['/tasks/task', taskId]);
  }


}
