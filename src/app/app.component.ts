import { Component } from '@angular/core';


export class Person {
  rank: number;
  name: string;
  familly: string;
}

@Component({
  selector: 'my-app',
  template: `<h1>{{title}}</h1>
  <div>{{who.name}}</div>`,
})
export class AppComponent  {
  title = 'La vieillitude';
  who: Person = {
  rank: 4,
  name: 'Paula',
  familly: 'Hodac'
};
}
