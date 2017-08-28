import { Component } from '@angular/core';
import { Person } from './person';


const PERSONS: Person[] = [
  {familly: "Hodac",    name: 'Anne-Laure'},
  {familly: "Hodac",    name: 'Dao'},
  {familly: "Hodac",    name: 'Fanny'},
  {familly: "Hodac",    name: 'Paula'},
  {familly: "Hodac",    name: 'Lucie'},
  {familly: "Brehault", name: 'Barbichu'},
  {familly: "Brehault", name: 'Caro'},
  {familly: "Brehault", name: 'Gabriel'},
  {familly: "Brehault", name: 'Victor'},
  {familly: "Brehault", name: 'Capucine'},
  {familly: "Lebreton", name: 'Etienne'},
  {familly: "Lebreton", name: 'Sophie'},
  {familly: "Lebreton", name: 'Pierre'},
  {familly: "Lebreton", name: 'Guillaume'},
  {familly: "Lebreton", name: 'Antoine' },
];

@Component({
  selector: 'my-app',
  styles: [`
  .selected {
    background-color: #CFD8DC !important;
    color: white;
  }
  .persons {
    margin: 0 0 2em 0;
    list-style-type: none;
    padding: 0;
    width: 15em;
  }
  .persons li {
    cursor: pointer;
    position: relative;
    left: 0;
    background-color: #EEE;
    margin: .5em;
    padding: .3em 0;
    height: 1.6em;
    border-radius: 4px;
  }
  .persons li.selected:hover {
    background-color: #BBD8DC !important;
    color: white;
  }
  .persons li:hover {
    color: #607D8B;
    background-color: #DDD;
    left: .1em;
  }
  .persons .text {
    position: relative;
    top: -3px;
  }
  .persons .badge {
    display: inline-block;
    font-size: small;
    color: white;
    padding: 0.8em 0.7em 0 0.7em;
    background-color: #607D8B;
    line-height: 1em;
    position: relative;
    left: -1px;
    top: -4px;
    height: 1.8em;
    margin-right: .8em;
    border-radius: 4px 0 0 4px;
  }
`],
  template: `<h1>{{title}}</h1>
  <ul class="persons">
  <li *ngFor="let p of persons"  (click)="onSelect(p)">
    <person [person]="p"></person>
  </li>
</ul>
`,
})
export class AppComponent  {
  title = 'La vieillitude';
  persons = PERSONS;
  selectedPerson: Person;

  onSelect(p: Person): void {
    console.log("selected "+p.name);
    this.selectedPerson = p;
  }
}
