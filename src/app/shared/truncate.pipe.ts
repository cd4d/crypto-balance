import { Pipe, PipeTransform } from '@angular/core';

// limit - string max length
// completeWords - Flag to truncate at the nearest complete word, instead of character
// ellipsis - appended trailing suffix

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 25, completeWords = false, ellipsis = ' [...]') {
    if (completeWords) {
      limit = value.substr(0, limit).lastIndexOf(' ');
    }
    return value.length > limit ? value.substr(0, limit) + ellipsis : value;
  }
}