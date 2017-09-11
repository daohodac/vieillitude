import { Component, OnInit, Input } from '@angular/core';
import { Person } from '../person';


const YEARS: any[] = [ {year: "2004", klass: "grey0"},
  {year: "2005", klass: "grey0"},
  {year: "2006", klass: "grey0"},
  {year: "2007", klass: "grey0"},
  {year: "2008", klass: "grey0"},
  {year: "2009", klass: "grey0"},
  {year: "2010", klass: "grey0"},
  {year: "2011", klass: "grey0"},
  {year: "2012", klass: "grey0"},
  {year: "2013", klass: "grey0"},
  {year: "2014", klass: "grey0"},
  {year: "2015", klass: "grey50"},
  {year: "2016", klass: "grey0"},
  {year: "2017", klass: "grey0"}
].reverse();

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
