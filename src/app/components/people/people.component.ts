import {Component, Input} from '@angular/core';
import {City} from "../../entity/city";

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent {
  @Input() city: City
}
