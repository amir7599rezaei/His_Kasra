import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'notSeenNotifyMessage',
  pure: false
})
export class NotSeenNotifyMessagePipe implements PipeTransform {

  transform(value: any): any {
    let number = 0;
    value.forEach(item => {
      if (item.IsRead == false) {
        number += 1;
      }
    });
    
    return number;
  }

}
