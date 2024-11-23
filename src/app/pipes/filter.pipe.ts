import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string, key: string = ''): any[] {
    if (!items) return [];
    if (!searchText) return items;

    searchText = searchText.toLowerCase();

    return items.filter(item => {
      if (key) {
        return item[key]?.toString().toLowerCase().includes(searchText);
      }
      return Object.values(item)
        .some(val => val?.toString().toLowerCase().includes(searchText));
    });
  }
}
