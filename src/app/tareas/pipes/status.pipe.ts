import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusPipe',
  standalone: true
})
export class StatusPipe implements PipeTransform {

  transform(value: boolean): string {
    return value ? 'Completed' : 'Pending';
  }

}
