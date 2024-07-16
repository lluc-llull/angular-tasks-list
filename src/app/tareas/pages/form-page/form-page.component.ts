import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TasksService } from '../../services/tasks.service';
import {Priority, Status, Task} from '../../interfaces/task.interface';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-form-page',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './form-page.component.html',
  styleUrl: './form-page.component.css'
})
export class FormPageComponent implements OnInit{
  statusOptions : Status[] = [
    {id: 1, name: 'Pending', color: '#5D6D7E'},
    {id: 2, name: 'On process', color: '#AF7AC5'},
    {id: 3, name: 'Completed', color: '#58D68D'},
  ]

  priorityOptions : Priority[] = [
    { id: 1, name: 'Urgent', color: '#EC7063', svg: 'assets/svg/flag_urgent.svg' },
    { id: 2, name: 'High', color: '#F4D03F', svg: 'assets/svg/flag_high.svg' },
    { id: 3, name: 'Medium', color: '#5DADE2', svg: 'assets/svg/flag_media.svg' },
    { id: 4, name: 'Low', color: '#AAB7B8', svg: 'assets/svg/flag_low.svg' },
  ]

  public myForm : FormGroup = this.fb.group({
    title: ['', Validators.required],
    status: [this.statusOptions[0]],
    priority: ['', Validators.required],
    createdAt: [],
    description: ['', Validators.minLength(10)],
    dueDate: [null, Validators.required],
  });

  errors: { [key: string]: string } = {
    title: 'This field is required',
    priority: 'This field is required',
    description: 'Details too short, minimum of 10 characters',
    dueDate: 'This field is required',
  };

  taskSaved : boolean = false;

  constructor(private fb: FormBuilder,  private taskService: TasksService) {}

  ngOnInit(): void {

    const statusControl = this.myForm.get('status');
    if (statusControl) {
      statusControl.valueChanges.subscribe(value => {
        if (value === null) {
          statusControl.setValue(false);
        }
      });
    }

    this.myForm.valueChanges.subscribe(() => {
      this.getFieldErrors();
    });

  }

  getFieldErrors(): void {
    for (const field in this.myForm.controls) {
      if (this.myForm.controls.hasOwnProperty(field)) {
        const control = this.myForm.get(field);
        if (control && control.errors && control.touched) {
          this.setErrorMessages(field, control.errors);
        }
      }
    }
  }

  setErrorMessages(field: string, errors: any): void {
    switch (field) {
      case 'title':
      case 'priority':
      case 'dueDate':
        if (errors['required']) {
          this.errors[field] = 'This field is required';
        }
        break;
      case 'description':
        if (errors['minlength']) {
          this.errors[field] = `Details too short, minimum of ${errors['minlength'].requiredLength} characters`;
        }
        break;
    }
  }


  onSave():void{
    if (this.myForm.valid) {
      const newTask: Task = {
        ...this.myForm.value,
        createdAt: new Date()
      };
      this.taskService.addTask(newTask);

      this.taskSaved = true;
      setTimeout(() => {
        this.taskSaved = false;
      }, 1000);
      this.myForm.reset();
    } else{
      this.getFieldErrors();
    }
  }
}
