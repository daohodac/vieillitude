import { Component, Input } from '@angular/core';
import { Person } from './person';



const YEARS: number[] = [
  2006, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017
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
