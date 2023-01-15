import {Component, OnInit} from '@angular/core';
import {CityService} from "./services/city.service";
import {City} from "./entity/city";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'CityEquipping';
  cityName = 'New York'
  city: City;

  constructor(private cityService: CityService) {

  }

  ngOnInit(): void {
    console.log(this.city)
    this.cityService.getCityByName(this.cityName)
    .subscribe(data => this.city = data[0]).add(() => console.log(this.city))
  }
}
