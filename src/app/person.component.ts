import { Component, Input } from '@angular/core';
import { Person } from './person';



const YEARS: number[] = [
  2002, 2003, 2004, 2005, 2006, 2007
];

@Component({
  selector: 'person',
  styleUrls: ['./person.component.css'],
	templateUrl: './person.component.html'
})
export class PersonComponent {
	@Input() person: Person;
  years= YEARS;
}
