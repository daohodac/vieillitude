import { Component } from '@angular/core';
import { Person } from './person';
import { PersonService } from './person.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [PersonService]
})
export class AppComponent {
  constructor(private personService: PersonService) { }

  title = 'La vieillitude';
  persons: Person[];
  selectedPerson: Person;

  getPersons(): void {
    this.persons = this.personService.getPersons();
  }

  ngOnInit(): void {
    this.getPersons();
  }
}
