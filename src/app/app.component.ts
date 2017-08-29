import { Component, OnInit } from '@angular/core';
import { Person } from './person';
import { PersonService } from './person.service';



@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ],
  providers: [PersonService]
})
export class AppComponent  implements OnInit {

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

  onSelect(p: Person): void {
    console.log("selected "+p.name);
    this.selectedPerson = p;
  }
}
