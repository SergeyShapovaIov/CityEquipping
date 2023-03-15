import { Injectable, ɵflushModuleScopingQueueAsMuchAsPossible } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { City } from "../entity/city";
import { BehaviorSubject, catchError, Observable, retry, throwError } from "rxjs";
import { ErrorService } from "./error.service";
import type { EChartsOption } from 'echarts';
import { MarkService } from './mark.service';
import { Link } from '../entity/link';
import { InfrastructureUnit } from '../entity/infrastructureUnit';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  cityData: any;

  population: number;

  dataObjects: BehaviorSubject<any> = new BehaviorSubject<Array<InfrastructureUnit>>([]);

  dataLinks: any = Array<Link>();

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
        name: 'Sports Facility',
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
              name: 'Sports Facility',
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

  private convertOSMDataInChartData(response: any): Array<InfrastructureUnit> {
    var ObjectDataOSM: any = Array();
    ObjectDataOSM = response["elements"];
    for (var i = 0; i < ObjectDataOSM.length; i++) {
      if (!ObjectDataOSM[i].hasOwnProperty("tags")) {
        ObjectDataOSM.splice(i, 1);
        i--;
      }
    }

    var ObjectData = Array<InfrastructureUnit>();

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
        value: value,
        category: categoreNumber,
        symbolSize: 10
      })
    }

    console.log(ObjectData);

    return ObjectData;
  };

  private configureDataLinksByData(dataObjects: any): Array<Link> {

    var dataLinksResult: any = Array<Link>();
  
    var sorceObjectArray : any = {
      sports_hall : [],
      sports_centre: [],
      pitch: [],
      track: [],
      swimming_pool: [],
      Other: []
    }

    for(var i = 0; i < dataObjects.length; i++) {
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

    console.log(sorceObjectArray.sports_centre);

    dataLinksResult = dataLinksResult.concat(this.generateNodeFigureByIdArray(sorceObjectArray.sports_centre));
    dataLinksResult = dataLinksResult.concat(this.generateNodeFigureByIdArray(sorceObjectArray.pitch));
    dataLinksResult = dataLinksResult.concat(this.generateNodeFigureByIdArray(sorceObjectArray.sports_hall));
    dataLinksResult = dataLinksResult.concat(this.generateNodeFigureByIdArray(sorceObjectArray.track));
    dataLinksResult = dataLinksResult.concat(this.generateNodeFigureByIdArray(sorceObjectArray.swimming_pool));
    dataLinksResult = dataLinksResult.concat(this.generateNodeFigureByIdArray(sorceObjectArray.Other));
    

    console.log(dataLinksResult);
    return dataLinksResult;
  }

  private generateNodeFigureByIdArray(sourceObjectArray: InfrastructureUnit[]) : Array<any> {

    var resultArray : any = Array<Link>();

   for(var i = 1; i < 4 && i < sourceObjectArray.length; i++) {
    resultArray.push({
      source: sourceObjectArray[0]["id"],
      target: sourceObjectArray[i]["id"]
    });
   }

   console.log(resultArray);
   console.log(sourceObjectArray);

   var countID: number = sourceObjectArray.length;
   var currentIndex: number = 4; 

   for(var i = 1; countID > 0; i++) {

    var sourceIdArray: number[] = Array<number>();
    var targetIdArray: number[] = Array<number>();
    

    for(var j = 0; j < i*3; j++) {
      if(sourceObjectArray[(currentIndex-i*3)+j] != undefined) {
        sourceIdArray[j] = sourceObjectArray[(currentIndex-i*3)+j]["id"];
      } else {
        break;
      }
    }
    for(var j = 0; j < i*3*2; j++) {
      if(sourceObjectArray[currentIndex] != undefined) {
        targetIdArray[j] = sourceObjectArray[currentIndex]["id"]
      } else {
        break;
      }
      currentIndex++;
    }

    countID -= i*3*2;

    console.log(sourceIdArray);
    console.log(targetIdArray);

    for(var j = 0; j < sourceIdArray.length; j++){
       resultArray.push({
        source: sourceIdArray[j],
        target: targetIdArray[(j)*2]
       });
       resultArray.push({
        source: sourceIdArray[j],
        target: targetIdArray[(j+1)*2-1]
       });
    }

    for(var j = 0; j < sourceIdArray.length; j++ )

    console.log(resultArray);
    console.log(i);
    console.log(countID);
   }

   console.log(resultArray);

  
   

   if(resultArray.length > 4) {

   }

   console.log(resultArray);



   return resultArray;
  }

  private threePointSnowflakeConstruction (pointNumber: number) {
    
  }
}
