import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import {ModalActionsComponent} from "./components/modal-actions/modal-actions.component";

@Component({
  selector: 'app-tareas',
  standalone: true,
  imports: [CommonModule, RouterModule, SideMenuComponent, ModalActionsComponent],
  templateUrl: './tareas.component.html',
  styleUrl: './tareas.component.css',
})
export class TareasComponent {

}
