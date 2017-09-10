import { Pipe, PipeTransform } from '@angular/core';
import { Person } from './person';

@Pipe({
  name: 'filterPerson'
})
export class FilterPersonPipe implements PipeTransform {

  transform(persons: Person[], search: String): any {
    if (!persons || !persons.length) return [];
    if (!search) return persons;

    let ret = persons.filter(p =>
      p.name.toLowerCase().indexOf(search.toLowerCase())>=0 ||
      p.familly.toLowerCase().indexOf(search.toLowerCase())>=0 
    );
    return ret;
  }

}
