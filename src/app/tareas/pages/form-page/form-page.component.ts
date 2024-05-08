import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  }

  isValidField(field: string):boolean|null {
    return this.myForm.controls[field].errors && this.myForm.controls[field].touched;
   }

  getFieldError(field: string):string|null {
    if(!this.myForm.controls[field]) return null;

    const errors = this.myForm.controls[field].errors || {};

    for (const key of Object.keys(errors)){
      switch (key){
        case 'required':
          return 'Este campo es requerido';
      }
    }

    return null;
  }

  onSave():void{
    if (this.myForm.valid) {
      const newTask: Task = this.myForm.value;
      this.taskService.addTask(newTask);

      console.log(this.taskService);
      this.myForm.reset();
    }
  }
}
