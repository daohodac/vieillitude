import { Component, OnInit, Input } from '@angular/core';
import { Person } from '../person';


const YEARS: number[] = [
  2004,2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017
];

@Component({
  selector: 'person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Input() person: Person;
  years= YEARS;

}
