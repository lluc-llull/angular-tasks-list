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
    {id: 1, name: 'Urgent', color: '#EC7063'},
    {id: 2, name: 'High', color: '#F4D03F'},
    {id: 3, name: 'Media', color: '#5DADE2'},
    {id: 4, name: 'Low', color: '#AAB7B8'},
  ]

  public myForm : FormGroup = this.fb.group({
    title: ['', Validators.required],
    status: [this.statusOptions[0]],
    priority: ['', Validators.required],
    createdAt: [],
    description: ['', Validators.minLength(10)],
    dueDate: [],
  });

  errors: { title: string, msg: string } = { title: '', msg: '' };

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
    this.getFieldError('title');

    const titleControl = this.myForm.get('title');

    if (titleControl) {
      titleControl.valueChanges.subscribe(() => {
        this.getFieldError('title');
      });
    }

    this.getFieldError('description');

    const descriptionControl = this.myForm.get('description');

    if (descriptionControl) {
      descriptionControl.valueChanges.subscribe(() => {
        this.getFieldError('description');
      });
    }
  }

  // isValidField(field: string):boolean|null {
  //   return this.myForm.controls[field].errors && this.myForm.controls[field].touched;
  // }

  getFieldError(field: string): void {
    if (!this.myForm.controls[field]) {
      return;
    }

    const errors = this.myForm.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key){
        case 'required':
          this.errors = { title: key, msg: 'This field is required' };
          return;
        case 'minlength':
          this.errors = { title: key, msg: `Details too short, minimum of ${errors['minlength'].requiredLength} characters` };
          return;
      }
    }

    this.errors = { title: '', msg: '' };
  }


  onSave():void{
    if (this.myForm.valid) {
      const date = new Date();
      const newTask: Task = {
        ...this.myForm.value,
        createdAt: date.toLocaleString()
      };
      this.taskService.addTask(newTask);
      console.log(newTask)
      this.myForm.reset();
    } else{
      this.getFieldError('title');
      this.getFieldError('description');
    }
  }
}
