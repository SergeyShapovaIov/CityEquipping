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
  cityData : any;
  updateOptions: any;

  options : any = this.cityService.options;

  constructor(public cityService: CityService,
              private searchService: SearchService
              ) {
                this.cityService.options.subscribe();

  }

  ngOnInit(): void {
    this.cityName$ = this.searchService.cityName;
    this.searchService.cityName$.subscribe((cityName) => {
        this.cityName = cityName;
    });
    this.cityService.getCityByName(this.cityName)
    .subscribe(data => this.city = data[0]).add(() => console.log(this.city));
    this.cityData = this.cityService.getDataByCityName(this.cityName);
  }

  changeCity(city : string) {
    this.searchService.changeCity(city);
    this.cityService.getCityByName(this.cityName)
    .subscribe(data => this.city = data[0]).add(() => console.log(this.city));
    this.cityData = this.cityService.getDataByCityName(this.cityName);
    this.options  = this.cityService.options;

  }
}
