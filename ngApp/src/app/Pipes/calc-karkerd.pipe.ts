import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'calcKarkerd',
  pure: false
})
export class CalcKarkerdPipe implements PipeTransform {
  transform(value: any, personId: any): any {
    var sum = 0;
    value.forEach(row => {
      if (row.PersonInfo.PersonID == personId) {
        for (const key in row.Days) {
          row.Days[key].Structures.forEach(structure => {
            sum += structure.Karkard;
          });
        }
      }
    });

    var s = (sum % 360) % 60;
    var m = Math.floor((sum % 360) / 60);
    var h = Math.floor(sum / 360);
    return ((h<=9)?("0" + h):h) + ':' + ((m<=9)?("0" + m):m) + ':' + ((s<=9)?("0" + s):s);
  }
}
