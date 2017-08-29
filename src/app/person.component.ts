import { Component, Input } from '@angular/core';
import { Person } from './person';



const YEARS: number[] = [
  2002, 2003, 2004, 2005, 2006, 2007
];

@Component({
  selector: 'person',
	template: `
    <div *ngIf="person">
			<span class="badge">{{person.familly}}</span> {{person.name}}
      <span *ngFor="let y of years">{{y}}</span>
    </div>
  `
})
export class PersonComponent {
	@Input() person: Person;
  years= YEARS;
}
