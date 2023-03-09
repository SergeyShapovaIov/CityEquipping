import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { City } from "../entity/city";
import { BehaviorSubject, catchError, Observable, retry, throwError } from "rxjs";
import { ErrorService } from "./error.service";
import type { EChartsOption } from 'echarts';
import { MarkService } from './mark.service';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  cityData: any;

  population: number;

  dataObjects: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  dataLinks: any = Array();

  optionsTemplate: EChartsOption = {
    title: {
      text: 'Sports facilities',
      subtext: 'Default layout',
      top: 'bottom',
      left: 'right'
    },
    tooltip: {},
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    legend: [
      {
        data: ["Sports Hall", "Sports Centre", "Pitch", "Track", "Swimming Pool", "Other"]
      }
    ],
    series: [
      {
        name: 'Les Miserables',
        type: 'graph',
        layout: 'force',
        data: this.dataObjects.value,
        links: this.dataLinks,
        categories: [
          { name: "Sports Hall" },
          { name: "Sports Centre" },
          { name: "Pitch" },
          { name: "Track" },
          { name: "Swimming Pool" },
          { name: "Other" }
        ],
        roam: true,
        label: {
          position: 'right'
        },
        force: {
          repulsion: 400
        }
      }
    ]
  };

  options: BehaviorSubject<EChartsOption> = new BehaviorSubject<EChartsOption>(this.optionsTemplate);

  constructor(
    private http: HttpClient,
    private errorService: ErrorService,
    private markService: MarkService
  ) { }

  getCityByName(name: string): Observable<City[]> {
    return this.http.get<City[]>('https://api.api-ninjas.com/v1/city?name='.concat(this.convertCityName(name)), {
      headers: {
        'X-Api-Key': 'VOtTuiAMf9PVpyk/eBgXEA==Lb8TN3LHVNQlqbVN'
      }
    }).pipe(
      retry(3),
      catchError(this.errorHandler.bind(this))
    )
  }

  getDataByCityName(nameCity: string): any {
    return this.http.get('https://overpass-api.de/api/interpreter?data=[out:json][timeout:200];area["name"="'
      .concat(nameCity)
      .concat('"]->.searchArea;(node["building"="sports_hall"](area.searchArea);way["building"="sports_hall"](area.searchArea);relation["building"="sports_hall"](area.searchArea);node["leisure"="sports_centre"](area.searchArea);way["leisure"="sports_centre"](area.searchArea);relation["leisure"="sports_centre"](area.searchArea);node["leisure"="pitch"](area.searchArea);way["leisure"="pitch"](area.searchArea);relation["leisure"="pitch"](area.searchArea);node["leisure"="sports_hall"](area.searchArea);way["leisure"="sports_hall"](area.searchArea);relation["leisure"="sports_hall"](area.searchArea);node["leisure"="swimming_pool"](area.searchArea);way["leisure"="swimming_pool"](area.searchArea);relation["leisure"="swimming_pool"](area.searchArea);node["leisure"="track"](area.searchArea);way["leisure"="track"](area.searchArea);relation["leisure"="track"](area.searchArea););out;>;out skel qt;'))
      .subscribe((response) => {

        this.dataObjects.next(this.convertOSMDataInChartData(response));

        this.dataLinks = this.configureDataLinksByData(this.dataObjects.value);

        this.options.next({
          title: {
            text: 'Sports facilities',
            subtext: 'Default layout',
            top: 'bottom',
            left: 'right'
          },
          tooltip: {},
          animationDurationUpdate: 1500,
          animationEasingUpdate: 'quinticInOut',
          legend: [
            {
              data: ["Sports Hall", "Sports Centre", "Pitch", "Track", "Swimming Pool", "Other"]
            }
          ],
          series: [
            {
              name: 'Les Miserables',
              type: 'graph',
              layout: 'force',
              data: this.dataObjects.value,
              links: this.dataLinks,
              categories: [
                { name: "Sports Hall" },
                { name: "Sports Centre" },
                { name: "Pitch" },
                { name: "Track" },
                { name: "Swimming Pool" },
                { name: "Other" }
              ],
              roam: true,
              label: {
                position: 'right'
              },
              force: {
                repulsion: 400
              }
            }
          ]
        });

        this.markService.mark.next(this.markService.getMarkByDataObjetsAndPopulation(this.dataObjects.value, this.population));
      });
  }

  private errorHandler(error: HttpErrorResponse) {
    this.errorService.handle(error.message)
    return throwError(() => error.message)
  }

  private convertCityName(cityName: string): string {

    const wordMap: any = {
      "Волгоград": "Volgograd",
      "Москва": "Moscow",
      "Воронеж": "Voronezh",
      "Саратов": "Saratov"
    };

    if (wordMap[cityName] !== undefined) {
      return wordMap[cityName]
    } else {
      return cityName
    }
  }

  private convertOSMDataInChartData(response: any): any {
    var ObjectDataOSM: any = Array();
    ObjectDataOSM = response["elements"];
    for (var i = 0; i < ObjectDataOSM.length; i++) {
      if (!ObjectDataOSM[i].hasOwnProperty("tags")) {
        ObjectDataOSM.splice(i, 1);
        i--;
      }
    }

    var ObjectData = Array();

    for (var i = 0; i < ObjectDataOSM.length; i++) {
      var name: string = "";
      var value: string = "";
      var categoryString: string;
      var categoreNumber: number = 0;
      var xCoordinate: number = 0;

      if (ObjectDataOSM[i]["tags"].hasOwnProperty("name")) {
        name = ObjectDataOSM[i]["tags"]["name"];
      }

      if (ObjectDataOSM[i]["tags"]["addr:street"]) {
        if (name == "") {
          name = ObjectDataOSM[i]["tags"]["addr:street"];
        } else {
          name += " - " + ObjectDataOSM[i]["tags"]["addr:street"];
        }
      }

      if (ObjectDataOSM[i]["tags"]["addr:housenumber"]) {
        if (name == "") {
          name = ObjectDataOSM[i]["tags"]["addr:housenumber"];
        } else {
          name += " " + ObjectDataOSM[i]["tags"]["addr:housenumber"];
        }
      }

      if (ObjectDataOSM[i]["tags"].hasOwnProperty("sport")) {
        value = ObjectDataOSM[i]["tags"]["sport"];
      }

      if (ObjectDataOSM[i]["tags"].hasOwnProperty("leisure")) {
        categoryString = ObjectDataOSM[i]["tags"]["leisure"];
      } else {
        categoryString = "Other";
      }

      switch (categoryString) {
        case "sports_hall": {
          categoreNumber = 0;
          xCoordinate = Math.random() * (3000 - 2500) + 2500;
          break;
        }
        case "sports_centre": {
          categoreNumber = 1;
          xCoordinate = Math.random() * (2499 - 2000) + 2000;
          break;
        }
        case "pitch": {
          categoreNumber = 2;
          xCoordinate = Math.random() * (1999 - 1500) + 1500;
          break;
        }
        case "track": {
          categoreNumber = 3;
          xCoordinate = Math.random() * (1499 - 1000) + 1000;
          break;
        }
        case "swimming_pool": {
          categoreNumber = 4;
          xCoordinate = Math.random() * (999 - 500) + 500;
          break;
        }
        case "Other": {
          categoreNumber = 5;
          xCoordinate = Math.random() * (499 - 0) + 0;
          break;
        }
      }

      ObjectData.push({
        id: i,
        name: name,
        x: xCoordinate,
        y: Math.random() * (2000 - 1000) + 1000,
        value: Math.random() * (100 - 0) + 0,
        category: categoreNumber
      })
    }

    console.log(ObjectData);

    return ObjectData;
  };

  private configureDataLinksByData(dataObjects: any): any {

    var dataLinksResult: any = Array();
    for (var i = 0; i < dataObjects.length; i++) {
      dataLinksResult.push({
        source: Math.round(Math.random() * (dataObjects.length - 0) + 0),
        target: Math.round(Math.random() * (dataObjects.length - 0) + 0)
      })
    }

    var sorceObjectArray : any = {
      sports_hall : [],
      sports_centre: [],
      pitch: [],
      track: [],
      swimming_pool: [],
      Other: []
    }

    for(var i = 0; i < dataObjects; i++) {
      switch(dataObjects[i]["category"]) {
        case 0: {
          sorceObjectArray.sports_hall.push(dataObjects[i]);
          break;
        }
        case 1: {
          sorceObjectArray.sports_centre.push(dataObjects[i]);
          break;
        }
        case 2: {
          sorceObjectArray.pitch.push(dataObjects[i]);
          break;
        }
        case 3: {
          sorceObjectArray.track.push(dataObjects[i]);
          break;
        }
        case 4: {
          sorceObjectArray.swimming_pool.push(dataObjects[i]);
          break;
        }
        case 5: {
          sorceObjectArray.Other.push(dataObjects[i]);
          break;
        }
      }
    }

    for(var i = 0; i <  sorceObjectArray.sports_hall.length; i++) {
      dataLinksResult.push({
        source: "f",
        target: "r"
      });
    }

    return dataLinksResult;
  }

  private generateNodeFigureByIdArray(id: number[]) : Array<any> {

    var resultArray : any = Array();

   for(var i = 1; i < 4 && i < id.length; i++) {
    resultArray.push({
      source: id[0],
      target: id[i]
    });
   }

   if(resultArray.length > 4) {

   }

   return resultArray;
  }

  private threePointSnowflakeConstruction (pointNumber: number, ) {
    
  }
}
