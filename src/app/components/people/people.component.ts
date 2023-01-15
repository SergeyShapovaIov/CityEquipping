import { Component } from '@angular/core';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent {

  private _people: number = 0

  get people(): number {
    return this._people;
  }

  set people(value: number) {
    this._people = value;
  }

}
