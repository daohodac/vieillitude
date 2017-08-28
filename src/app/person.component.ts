import { Component, Input } from '@angular/core';
import { Person } from './person';

@Component({
  selector: 'person',
	template: `
    <div *ngIf="person">
			<span class="badge">{{person.familly}}</span> {{person.name}}
    </div>
  `
})
export class PersonComponent {
	@Input() person: Person;
}
