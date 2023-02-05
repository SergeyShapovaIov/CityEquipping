import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit{

  // constructor(private searchService: SearchService) {

  // }

  // sendCityValue(event : any) : void {
  //   var cityName  = document.getElementsByTagName("input")[0].value;
  //   this.searchService.cityName = cityName;

  @Output() outChangeCity = new EventEmitter<string>();
  constructor() {}

  ngOnInit(): void {}

  enterCity(cityInput: HTMLInputElement) {
    this.outChangeCity.emit(cityInput.value);
  }
}

