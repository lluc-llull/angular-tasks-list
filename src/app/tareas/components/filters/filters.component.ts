import {Component, EventEmitter, Output} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Priority, Status} from "../../interfaces/task.interface";

@Component({
  selector: 'filters',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css'
})
export class FiltersComponent {
  @Output() filterByPriority = new EventEmitter<string>();
  @Output() filterByStatus = new EventEmitter<string>();

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

  selectedPriority: string = '';
  selectedStatus: string = '';

  constructor() {}

  applyPriorityFilter(): void {
    this.filterByPriority.emit(this.selectedPriority);
  }

  applyStatusFilter(): void {
    this.filterByStatus.emit(this.selectedStatus);
  }
}
