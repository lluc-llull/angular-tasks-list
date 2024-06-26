import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tasks',
    loadComponent: () => import('./tareas/tareas.component').then(m => m.TareasComponent),
    children: [
      {path: 'list', title:'List', loadComponent: () => import('./tareas/pages/list-page/list-page.component').then(m => m.ListPageComponent)},
      {path: 'task/:id', title:'Task', loadComponent: () => import('./tareas/pages/task-page/task-page.component').then(m => m.TaskPageComponent)},
      {path: 'create', title:'Add', loadComponent: () => import('./tareas/pages/form-page/form-page.component').then(m => m.FormPageComponent)},
      {path: 'stats', title:'Stats', loadComponent: () => import('./tareas/pages/stats-page/stats-page.component').then(m => m.StatsPageComponent)},
      {path: '', redirectTo: 'list', pathMatch: 'full'},
    ]
  },
  {
    path: '',
    redirectTo: '/tasks',
    pathMatch: 'full'
  }
];
