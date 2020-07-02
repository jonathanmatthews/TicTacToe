import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noughtCross'
})
export class NoughtCrossPipe implements PipeTransform {

  transform(cellPlayerNumber: number): string {
    switch(cellPlayerNumber) {
      case 1: return 'X';
      case 2: return 'O';
      default: return '';
    }
  }
}
