import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-people',
  templateUrl: './population.component.html',
  styleUrls: ['./population.component.scss']
})
export class PopulationComponent {
  @Input() population: number
}
