import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TasksService } from '../../services/tasks.service';
import { Task } from '../../interfaces/task.interface';

@Component({
  selector: 'app-form-page',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './form-page.component.html',
  styleUrl: './form-page.component.css'
})
export class FormPageComponent implements OnInit{
  public myForm : FormGroup = this.fb.group({
    title: ['', Validators.required],
    completed: [false],
  });

  errors: { title: string, msg: string } = { title: '', msg: '' };

  constructor(private fb: FormBuilder,  private taskService: TasksService) {}

  ngOnInit(): void {

    const completedControl = this.myForm.get('completed');
    if (completedControl) {
      completedControl.valueChanges.subscribe(value => {
        if (value === null) {
          completedControl.setValue(false);
        }
      });
    }
    this.getFieldError('title');
    
    const titleControl = this.myForm.get('title');

    if (titleControl) {
      titleControl.valueChanges.subscribe(() => {
        this.getFieldError('title');
      });
    }
  }

  isValidField(field: string):boolean|null {
    return this.myForm.controls[field].errors && this.myForm.controls[field].touched;
  }

  getFieldError(field: string): void {
    if (!this.myForm.controls[field]) {
      return;
    }

    const errors = this.myForm.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      if (key === 'required') {
        this.errors = { title: key, msg: 'Este campo es requerido' };
        return;
      }
    }

    this.errors = { title: '', msg: '' };
  }


  onSave():void{
    if (this.myForm.valid) {
      const newTask: Task = this.myForm.value;
      this.taskService.addTask(newTask);
      this.myForm.reset();
    } else{
      this.getFieldError('title');
    }
  }
}
