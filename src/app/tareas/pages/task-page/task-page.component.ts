import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TasksService } from '../../services/tasks.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { Task } from '../../interfaces/task.interface';
import { StatusPipe } from '../../pipes/status.pipe';

@Component({
  selector: 'app-task-page',
  standalone: true,
  imports: [RouterModule, StatusPipe],
  templateUrl: './task-page.component.html',
  styleUrl: './task-page.component.css'
})
export class TaskPageComponent {
  public task: Task | undefined;

  constructor(private route: ActivatedRoute, private tasksService: TasksService) { }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(({ id }) => this.tasksService.getTaskById(+id))
    ).subscribe(task => {
      this.task = task;
    });
  }
}
