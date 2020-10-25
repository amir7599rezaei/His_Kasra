import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'structureCounting',
  pure: false
})
export class structureCountingPipe implements PipeTransform {

  transform(value: any, CategoryStructureID: any, personId: any): any {
    var number = 0;
    value.forEach(row => {
      if (row.PersonInfo.PersonID == personId) {
        for (const key in row.Days) {
          row.Days[key].Structures.forEach(structure => {
            if (structure.CategoryStructureID == CategoryStructureID) {
              number++;
            }
          });
        }
      }
    });
    return number;
  }
}
