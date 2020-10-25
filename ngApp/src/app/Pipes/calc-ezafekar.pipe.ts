import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'calcEzafekar'
})
export class CalcEzafekarPipe implements PipeTransform {
  transform(value: any,   personId: any): any {
    var sumKarkard = 0;
    var sumMovazafi= 0;
    value.forEach(row => {
      if (row.PersonInfo.PersonID == personId) {
        for (const key in row.Days) {
          sumMovazafi+= row.Days[key].Movazafi;
          row.Days[key].Structures.forEach(structure => {
            sumKarkard+=structure.Karkard;
          });
        }
      }
    });
    return sumKarkard-sumMovazafi;
  }
}
