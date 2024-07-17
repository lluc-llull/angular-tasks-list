import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TasksService } from '../../services/tasks.service';
import {Priority, Status, Task} from '../../interfaces/task.interface';
import { StatusPipe } from '../../pipes/status.pipe';
import { Observable, Subscription, map, of, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import {ModalActionsComponent} from "../../components/modal-actions/modal-actions.component";
import { DomSanitizer } from '@angular/platform-browser';
import {ReactiveFormsModule} from "@angular/forms";
import {FiltersComponent} from "../../components/filters/filters.component";

@Component({
  selector: 'app-list-page',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusPipe, ModalActionsComponent, ReactiveFormsModule, FiltersComponent],
  templateUrl: './list-page.component.html',
  styleUrl: './list-page.component.css'
})
export class ListPageComponent implements OnInit, OnDestroy {
  statusOptions : Status[] = [
    {id: 1, name: 'Pending', color: '#5D6D7E'},
    {id: 2, name: 'On process', color: '#AF7AC5'},
    {id: 3, name: 'Completed', color: '#58D68D'},
  ]

  priorityOptions : Priority[] = [
    { id: 1, name: 'Urgent', color: '#EC7063', svg: 'assets/svg/flag_urgent.svg' },
    { id: 2, name: 'High', color: '#F4D03F', svg: 'assets/svg/flag_high.svg' },
    { id: 3, name: 'Media', color: '#5DADE2', svg: 'assets/svg/flag_media.svg' },
    { id: 4, name: 'Low', color: '#AAB7B8', svg: 'assets/svg/flag_low.svg' },
  ]

  task1 : Task = {id:1, title: 'Task 1', description: 'This is the description of Task 1', status: this.statusOptions[0], priority: this.priorityOptions[0], dueDate: new Date(2024, 1,13), createdAt: new Date(2023,12, 19)};
  task2 : Task = {id:2, title: 'Task 2', description: 'This is the description of Task 2', status: this.statusOptions[1], priority: this.priorityOptions[2], dueDate: new Date(2024, 2,22), createdAt: new Date(2024,1, 3)};
  task3 : Task = {id:3, title: 'Task 3', description: 'This is the description of Task 3', status: this.statusOptions[2], priority: this.priorityOptions[1], dueDate: new Date(2024, 3,4), createdAt: new Date(2024,2, 4)};
  task4 : Task = {id:4, title: 'Task 4', description: 'This is the description of Task 4', status: this.statusOptions[1], priority: this.priorityOptions[3], dueDate: new Date(2024, 4,27), createdAt: new Date(2024,3, 12)};
  task5 : Task = {id:5, title: 'Task 5', description: 'This is the description of Task 5', status: this.statusOptions[0], priority: this.priorityOptions[0], dueDate: new Date(2024, 5,16), createdAt: new Date(2024,4, 29)};
  task6 : Task = {id:6, title: 'Task 6', description: 'This is the description of Task 6', status: this.statusOptions[1], priority: this.priorityOptions[1], dueDate: new Date(2024, 6,9), createdAt: new Date(2024,5, 8)};
  task7 : Task = {id:7, title: 'Task 7', description: 'This is the description of Task 7', status: this.statusOptions[2], priority: this.priorityOptions[3], dueDate: new Date(2024, 7,20), createdAt: new Date(2024,6, 23)};
  task8 : Task = {id:8, title: 'Task 8', description: 'This is the description of Task 8', status: this.statusOptions[2], priority: this.priorityOptions[2], dueDate: new Date(2024, 8,1), createdAt: new Date(2024,7, 5)};
  task9 : Task = {id:9, title: 'Task 9', description: 'This is the description of Task 9', status: this.statusOptions[1], priority: this.priorityOptions[2], dueDate: new Date(2024, 2,14), createdAt: new Date(2024,1, 23)};
  task10 : Task = {id:10, title: 'Task 10', description: 'This is the description of Task 10', status: this.statusOptions[1], priority: this.priorityOptions[3], dueDate: new Date(2024, 3,25), createdAt: new Date(2024,2, 10)};
  task11 : Task = {id:11, title: 'Task 11', description: 'This is the description of Task 11', status: this.statusOptions[0], priority: this.priorityOptions[1], dueDate: new Date(2024, 3,26), createdAt: new Date(2024,1, 16)};
  task12 : Task = {id:12, title: 'Task 12', description: 'This is the description of Task 12', status: this.statusOptions[2], priority: this.priorityOptions[0], dueDate: new Date(2024, 5,2), createdAt: new Date(2024,2, 5)};
  task13 : Task = {id:13, title: 'Task 13', description: 'This is the description of Task 13', status: this.statusOptions[0], priority: this.priorityOptions[0], dueDate: new Date(2024, 6,17), createdAt: new Date(2024,5, 12)};
  task14 : Task = {id:14, title: 'Task 14', description: 'This is the description of Task 14', status: this.statusOptions[0], priority: this.priorityOptions[2], dueDate: new Date(2024, 8,27), createdAt: new Date(2024,6, 25)};
  task15 : Task = {id:15, title: 'Task 15', description: 'This is the description of Task 15', status: this.statusOptions[0], priority: this.priorityOptions[2], dueDate: new Date(2024, 8,13), createdAt: new Date(2024,7, 2)};
  task16 : Task = {id:16, title: 'Task 16', description: 'This is the description of Task 16', status: this.statusOptions[1], priority: this.priorityOptions[2], dueDate: new Date(2024, 8,4), createdAt: new Date(2024,7, 16)};
  task17 : Task = {id:17, title: 'Task 17', description: 'This is the description of Task 17', status: this.statusOptions[2], priority: this.priorityOptions[2], dueDate: new Date(2024, 8,22), createdAt: new Date(2024,7, 22)};


  modalOpen = false;

  openModal() {
    this.modalOpen = true;
  }
  handleClose() {
    this.modalOpen = false;
  }

  selectedPriority: string = '';
  selectedStatus: string = '';

  tasksList$!: Observable<Task[]>;
  private tasksSubscription: Subscription = new Subscription();

  constructor(private taskService: TasksService, private router: Router, private _sanitizer: DomSanitizer){
    this.taskService.addTask(this.task1);
    this.taskService.addTask(this.task2);
    this.taskService.addTask(this.task3);
    this.taskService.addTask(this.task4);
    this.taskService.addTask(this.task5);
    this.taskService.addTask(this.task6);
    this.taskService.addTask(this.task7);
    this.taskService.addTask(this.task8);
    this.taskService.addTask(this.task9);
    this.taskService.addTask(this.task10);
    this.taskService.addTask(this.task11);
    this.taskService.addTask(this.task12);
    this.taskService.addTask(this.task13);
    this.taskService.addTask(this.task14);
    this.taskService.addTask(this.task15);
    this.taskService.addTask(this.task16);
    this.taskService.addTask(this.task17);
  }

  ngOnInit(): void {
    this.loadAllTasks();
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

  loadAllTasks(): void {
    this.tasksList$ = this.taskService.getTasksObservable().pipe(
      tap(tasks => {
        this.tasksList$ = of(tasks);
      })
    );
    this.tasksSubscription = this.tasksList$.subscribe();
  }

  onPriorityFilterChanged(selectedPriority: string): void {
    this.selectedPriority = selectedPriority;
    if (this.selectedPriority) {
      console.log('Applying priority filter:', this.selectedPriority);
      this.tasksList$ = this.taskService.getTasksByPriority(this.selectedPriority);
    } else {
      this.loadAllTasks();
    }
  }

  onStatusFilterChanged(selectedStatus: string): void {
    this.selectedStatus = selectedStatus;
    if (this.selectedStatus) {
      console.log('Applying status filter:', this.selectedStatus);
      this.tasksList$ = this.taskService.getTasksByStatus(this.selectedStatus);
    } else {
      this.loadAllTasks();
    }
  }
}
