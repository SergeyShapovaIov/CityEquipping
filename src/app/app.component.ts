import {Component, OnInit} from '@angular/core';
import {CityService} from "./services/city.service";
import { SearchService } from './services/search.service';
import {City} from "./entity/city";
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'CityEquipping';
  cityName$ : Observable<string>;
  cityName : string  = "";
  city: City;

  constructor(private cityService: CityService,
              private searchService: SearchService) {

  }

  ngOnInit(): void {
    this.cityName$ = this.searchService.cityName;
    this.searchService.cityName$.subscribe((cityName) => {
        this.cityName = cityName;
    });
    this.cityService.getCityByName(this.cityName)
    .subscribe(data => this.city = data[0]).add(() => console.log(this.city))
  }

  changeCity(city : string) {
    this.searchService.changeCity(city);
    this.cityService.getCityByName(this.cityName)
    .subscribe(data => this.city = data[0]).add(() => console.log(this.city))
  }
}
