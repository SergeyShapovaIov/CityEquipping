import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-map-component',
  templateUrl: './map-component.component.html',
  styleUrls: ['./map-component.component.scss']
})
export class MapComponentComponent {
  @Input() latitudeCity: number;
  @Input() longitudeCity: number;

  
}
