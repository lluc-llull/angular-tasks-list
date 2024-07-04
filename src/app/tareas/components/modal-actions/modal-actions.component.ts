import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from "@angular/common";
import {StatusPipe} from "../../pipes/status.pipe";

@Component({
  selector: 'modal-actions',
  standalone: true,
  imports: [CommonModule, StatusPipe],
  templateUrl: './modal-actions.component.html',
  styleUrl: './modal-actions.component.css'
})
export class ModalActionsComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  @Input() item: any;
  // @Input() togglestatus: (item: any) => void = () => {};
  // @Input() navigateToTask: (id: number) => void = () => {};
  // @Input() deleteValue: (item: any) => void = () => {};

  @Output() togglestatus = new EventEmitter<any>();
  @Output() navigateToTask = new EventEmitter<number>();
  @Output() deleteValue = new EventEmitter<any>();

  onTogglestatus() {
    this.togglestatus.emit(this.item);
  }

  onNavigateToTask() {
    this.navigateToTask.emit(this.item.id);
  }

  onDeleteValue() {
    this.deleteValue.emit(this.item);
  }

  closeModal() {
    this.isOpen = false;
    this.close.emit();
  }
}
