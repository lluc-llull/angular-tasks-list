import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TasksService } from '../../services/tasks.service';
import { switchMap } from 'rxjs';
import {Task} from '../../interfaces/task.interface';
import { StatusPipe } from '../../pipes/status.pipe';
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-task-page',
  standalone: true,
  imports: [RouterModule, StatusPipe, DatePipe],
  templateUrl: './task-page.component.html',
  styleUrl: './task-page.component.css'
})
export class TaskPageComponent {
  public task: Task | undefined;

  constructor(private route: ActivatedRoute, private tasksService: TasksService) {}

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(({ id }) => this.tasksService.getTaskById(+id))
    ).subscribe(task => {
      this.task = task;
    });
  }
}
