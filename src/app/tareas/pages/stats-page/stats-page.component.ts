import { Component, OnInit, Pipe } from '@angular/core';
import {Priority, Status, Task} from '../../interfaces/task.interface';
import { TasksService } from '../../services/tasks.service';
import { StatusPipe } from '../../pipes/status.pipe';
import {Observable, Subscription, map,} from 'rxjs';
import { CommonModule } from '@angular/common';
import Chart from "chart.js/auto";

interface GroupedTask {
  count: number;
  color: [number, number, number];
}

type GroupedTasksByStatus = {
  [status: string]: GroupedTask;
};

@Component({
  selector: 'app-stats-page',
  standalone: true,
  imports: [CommonModule, StatusPipe],
  templateUrl: './stats-page.component.html',
  styleUrl: './stats-page.component.css'
})
export class StatsPageComponent implements OnInit{

  tasksList$!: Observable<Task[]>;
  tasksListCompleted$!: Observable<Task[]>;
  tasksListPending$!: Observable<Task[]>;
  tasksListOnProcess$!: Observable<Task[]>;
  tasksListPriorityUrgent$!: Observable<Task[]>;
  tasksListPriorityHigh$!: Observable<Task[]>;
  tasksListPriorityMedia$!: Observable<Task[]>;
  tasksListPriorityLow$!: Observable<Task[]>;
  tasksListMonthly$!: Observable<Task[]>;
  private tasksSubscription: Subscription = new Subscription();

  tasksListPriorityUrgentLength: number = 0;
  tasksListPriorityHighLength: number = 0;
  tasksListPriorityMediaLength: number = 0;
  tasksListPriorityLowLength: number = 0;

  colorPriorities: number[][] = [];
  groupedTasksByStatus: any;

  chartPending: any;
  chartOnProcess: any;
  chartCompleted: any;
  chartPriorities: any;
  chartMonthly: any;

  constructor(private taskService: TasksService){ }

  ngOnInit(): void {
    //this.refreshTasksList();

    // this.tasksList$ = this.taskService.getTasksObservable().pipe(
    //   switchMap(tasks => {
    //     this.tasksListCompleted$ = of(tasks.filter(task => task.status.name == 'Completed'));
    //     this.tasksListPending$ = of(tasks.filter(task => task.status.name == 'Pending'));
    //     this.tasksListOnProcess$ = of(tasks.filter(task => task.status.name == 'On process'));
    //     return of(tasks);
    //   })
    // );

    this.tasksList$ = this.taskService.getTasksObservable();

    this.tasksListCompleted$ = this.tasksList$.pipe(
      map(tasks => tasks.filter(task => task.status.name === 'Completed'))
    );

    this.tasksListPending$ = this.tasksList$.pipe(
      map(tasks => tasks.filter(task => task.status.name === 'Pending'))
    );

    this.tasksListOnProcess$ = this.tasksList$.pipe(
      map(tasks => tasks.filter(task => task.status.name === 'On process'))
    );

    this.tasksListPriorityUrgent$ = this.taskService.getTasksByPriority('Urgent');
    this.tasksListPriorityUrgent$.subscribe(tasks => {
      this.tasksListPriorityUrgentLength = tasks.length;
      this.colorPriorities.push(this.hexToRgb(tasks[0].priority.color));
    });

    this.tasksListPriorityHigh$ = this.taskService.getTasksByPriority('High');
    this.tasksListPriorityHigh$.subscribe(tasks => {
      this.tasksListPriorityHighLength = tasks.length;
      this.colorPriorities.push(this.hexToRgb(tasks[0].priority.color));
    });

    this.tasksListPriorityMedia$ = this.taskService.getTasksByPriority('Media');
    this.tasksListPriorityMedia$.subscribe(tasks => {
      this.tasksListPriorityMediaLength = tasks.length;
      this.colorPriorities.push(this.hexToRgb(tasks[0].priority.color));
    });

    this.tasksListPriorityLow$ = this.taskService.getTasksByPriority('Low');
    this.tasksListPriorityLow$.subscribe(tasks => {
      this.tasksListPriorityLowLength = tasks.length;
      this.colorPriorities.push(this.hexToRgb(tasks[0].priority.color));
    });

    this.tasksListMonthly$ = this.taskService.getTasksByMonth();
    this.tasksListMonthly$.subscribe(tasks => {
      this.groupedTasksByStatus = this.groupTasksByStatus(tasks);
    });

    this.createChart();

    const countDonut: number[] = [this.tasksListPriorityUrgentLength, this.tasksListPriorityHighLength, this.tasksListPriorityMediaLength, this.tasksListPriorityLowLength];
    this.updateDonutChartData(this.chartPriorities, countDonut, this.colorPriorities);

    this.updateBarChartData(this.chartMonthly, this.groupedTasksByStatus)

    this.tasksSubscription.add(
      this.tasksListPending$.subscribe(pendingTasks => {
        const groupedPendingTasks = this.groupTasksByMonth(pendingTasks);
        const getColor = this.hexToRgb(pendingTasks[0].status.color);
        this.updateLineChartData(this.chartPending, groupedPendingTasks, getColor);
        // this.updateLineChartData(this.chartPending2, groupedPendingTasks, getColor);
      })
    );

    this.tasksSubscription.add(
      this.tasksListOnProcess$.subscribe(onProcessTasks => {
        const groupedOnProcessTasks = this.groupTasksByMonth(onProcessTasks);
        const getColor = this.hexToRgb(onProcessTasks[0].status.color);
        this.updateLineChartData(this.chartOnProcess, groupedOnProcessTasks, getColor);
      })
    );

    this.tasksSubscription.add(
      this.tasksListCompleted$.subscribe(completedTasks => {
        const groupedCompletedTasks = this.groupTasksByMonth(completedTasks);
        const getColor = this.hexToRgb(completedTasks[0].status.color);
        this.updateLineChartData(this.chartCompleted, groupedCompletedTasks, getColor);
      })
    );

  }

  ngOnDestroy(): void {
    this.tasksSubscription.unsubscribe();
  }

  refreshTasksList(): void {
    // this.taskService.getTasksObservable().pipe(
    //   tap(tasks => {
    //     this.tasksList$ = of(tasks);
    //   })
    // ).subscribe();
  }

  private _sortColumn: string = '';
  private _sortDirection: 'asc' | 'desc' = 'asc';

  get getSortDirection(): string {
    return this._sortDirection;
  }

  get getSortColumn(): string {
    return this._sortColumn;
  }

  sortData(column: string): void {
    if (column === this.getSortColumn) {
      this._sortDirection = this._sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this._sortColumn = column;
      this._sortDirection = 'asc';
    }

    this.tasksList$ = this.tasksList$.pipe(
      map(tasks => {
        return tasks.sort((a, b) => {
          const aValue = this.getValue(a, this.getSortColumn);
          const bValue = this.getValue(b, this.getSortColumn);

          if (aValue < bValue) {
            return this.getSortDirection === 'asc' ? -1 : 1;
          } else if (aValue > bValue) {
            return this.getSortDirection === 'asc' ? 1 : -1;
          } else {
            return 0;
          }
        });
      })
    );
  }

  getValue(item: any, column: string): any {
    if (column === 'status') {
      return item[column] ? 1 : 0;
    }
    return item[column];
  }

  private groupTasksByStatus(tasks: Task[]): GroupedTasksByStatus {
    return tasks.reduce<GroupedTasksByStatus>((acc, task) => {
      const status = task.status.name;
      const color = this.hexToRgb(task.status.color);

      if (!acc[status]) {
        acc[status] = { count: 0, color: color };
      }

      acc[status].count++;

      return acc;
    }, {});
  }

  createChart(): void {
    this.chartPending = new Chart('pendingChart', {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Pending Tasks',
            data: [],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderWidth: 1,
            pointBackgroundColor: 'rgb(255, 99, 132)',
            fill: true,
            tension: 0.5,
            pointRadius: 0,
            pointHitRadius: 10,
          }
        ]
      },
      options: {
        responsive: true,
        aspectRatio: 2.5,
        plugins: {
          legend: {
            display: false,
          }
        }
      }
    });

    this.chartOnProcess = new Chart('onProcessChart', {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Tasks On Process',
            data: [],
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 2,
            pointBackgroundColor: 'rgb(75, 192, 192)',
            fill: true,
            tension: 0.5,
            pointRadius: 0,
            pointHitRadius: 10,
          }
        ]
      },
      options: {
        responsive: true,
        aspectRatio: 2.5,
        plugins: {
          legend: {
            display: false,
          }
        }
      }
    });

    this.chartCompleted = new Chart('completedChart', {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Completed Tasks',
            data: [],
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderWidth: 2,
            pointBackgroundColor: 'rgb(54, 162, 235)',
            fill: true,
            tension: 0.5,
            pointRadius: 0,
            pointHitRadius: 10,
          }
        ]
      },
      options: {
        responsive: true,
        aspectRatio: 2.5,
        plugins: {
          legend: {
            display: false,
          }
        }
      }
    });

    this.chartMonthly = new Chart('monthlyChart', {
      type: 'bar',
      data: {
        labels: [''],
        datasets: [
          {
            label: '',
            data: '',
            borderColor: '',
            backgroundColor: '',
            borderWidth: 2,
          },
          {
            data: '',
            borderColor: '',
            backgroundColor: '',
            borderWidth: 2,
          },
          {
            data: '',
            borderColor: '',
            backgroundColor: '',
            borderWidth: 2,
          }
        ]
      },
      options: {
        responsive: true,
        aspectRatio: 2.5,
        plugins: {
          legend: {
            display: false,
          }
        },
        scales: {
          x: {
            stacked: true,
            beginAtZero: true,
          },
          y: {
            stacked: true,
            beginAtZero: true,
          }
        },
      }
    });

    this.chartPriorities = new Chart('prioritiesChart', {
      type: 'doughnut',
      data: {
        labels: ['Urgent', 'High', 'Media', 'Low'],
        datasets: [
          {
            label: 'Task Priorities',
            data: [],
            backgroundColor: [],
            hoverOffset: 4,
          }
        ]
      },
      options: {
        responsive: true,
        aspectRatio: 2.5,
        cutout: 110,
        plugins: {
          legend: {
            display: true,
            position: 'left',
            labels:{
              usePointStyle:  true,
              pointStyle: 'circle',
              padding: 25,
            }
          }
        }
      }
    });
  }

  private groupTasksByMonth(tasks: Task[]): number[] {
    const monthsData = Array.from({ length: 12 }, () => 0);

    tasks.forEach(task => {
      const dueDate = new Date(task.dueDate);
      const monthIndex = dueDate.getMonth();
      monthsData[monthIndex]++;
    });

    return monthsData;
  }

  private hexToRgb(hex: string): [number, number, number] {
    // Remove the hash symbol if it's there
    hex = hex.replace(/^#/, '');

    // Parse the hex string to RGB values
    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;

    return [r, g, b];
  }

  private updateLineChartData(chart: any, data: number[], color: [number, number, number]): void {
    if (chart) {
      chart.data.datasets[0].data = data;
      chart.data.datasets[0].borderColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
      chart.data.datasets[0].backgroundColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.2)`;
      chart.data.datasets[0].pointBackgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
      chart.update();
    }
  }

  private updateDonutChartData(chart: any, data: number[], color: number[][]): void {
    if (chart) {
      chart.data.datasets[0].data = data;
      chart.data.datasets[0].backgroundColor = color.map(rgb => `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);
      chart.update();
    }
  }

  private updateBarChartData(chart: any, groupedTasksByStatus: any[]): void {
    if (chart && groupedTasksByStatus) {
      const keys = Object.keys(groupedTasksByStatus);
      chart.data.datasets.forEach((dataset: any, index: number) => {
        if (index < keys.length) {
          const key:any = keys[index];
          const statusData = groupedTasksByStatus[key];

          if (statusData && statusData.count !== undefined && statusData.color) {
            dataset.data = [statusData.count];
            dataset.label = key;
            dataset.borderColor = `rgb(${statusData.color.join(',')})`;
            dataset.backgroundColor = `rgba(${statusData.color.join(',')}, 0.2)`;
          }
        }
      });
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth()+1;
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      const monthName = monthNames[currentMonth - 1];
      chart.data.labels = [monthName];
      chart.update();
    }
  }





}
