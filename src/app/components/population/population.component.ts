import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-people',
  templateUrl: './population.component.html',
  styleUrls: ['./population.component.scss']
})
export class PopulationComponent implements OnInit {
  @Input() cityName: string;
  @Input() population: number;

  constructor() {}

  ngOnInit(): void {

  }
}
