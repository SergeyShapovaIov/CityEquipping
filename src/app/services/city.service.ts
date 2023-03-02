import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {City} from "../entity/city";
import {BehaviorSubject, catchError, Observable, retry, throwError} from "rxjs";
import {ErrorService} from "./error.service";
import type { EChartsOption } from 'echarts';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  cityData : any;

  dataObjects: BehaviorSubject<any> = new BehaviorSubject<any>(
    [{
      name: 'Node 1',
      x: 300,
      y: 300
    }, {
      name: 'Node 2',
      x: 800,
      y: 300
    }, {
      name: 'Node 3',
      x: 550,
      y: 100
    }, {
      name: 'Node 4',
      x: 550,
      y: 500
    }, {
      name: 'Node 5',
      x: 600,
      y: 500
    }]
  );

  dataLinks : any = [{
    source: 0,
    target: 1,
    symbolSize: [5, 20],
    label: {
      show: true,
    },
    lineStyle: {
      width: 5,
      curveness: 0.2,
    }
  },
  // {
  //   source: 'Node 2',
  //   target: 'Node 1',
  //   label: {
  //     show: true,
  //   },
  //   lineStyle: {
  //     curveness: 0.2,
  //   }
  // }, 
  // {
  //   source: 'Node 1',
  //   target: 'Node 3'
  // }, {
  //   source: 'Node 2',
  //   target: 'Node 3'
  // }, {
  //   source: 'Node 2',
  //   target: 'Node 4'
  // }, {
  //   source: 'Node 1',
  //   target: 'Node 4'
  // }, {
  //   source: 'Node 4',
  //   target: 'Node 3'
  // }
];

  options: BehaviorSubject<EChartsOption> = new BehaviorSubject<EChartsOption>(
    {
    title: {
      text: ''
    },
    tooltip: {},
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    series: [
      {
        type: 'graph',
        layout: 'none',
        symbolSize: 20,
        roam: true,
        label: {
          show: true,
        },
        edgeSymbol: ['circle', 'arrow'],
        edgeSymbolSize: [4, 10],
        edgeLabel: {
          fontSize: 20,
        },
        data: this.dataObjects.value,
        links: this.dataLinks,
        lineStyle: {
          opacity: 0.9,
          width: 2,
          curveness: 0,
        }
      }
    ]
  }
  );

  constructor(
    private http: HttpClient,
    private errorService: ErrorService
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

  getDataByCityName(nameCity: string) : any {
    return this.http.get('https://overpass-api.de/api/interpreter?data=[out:json][timeout:70];area["name"="'
    .concat(nameCity)
    .concat('"]->.searchArea;(node["building"="hospital"](area.searchArea);way["building"="hospital"](area.searchArea);relation["building"="hospital"](area.searchArea););out;>;out skel qt;'))
    .subscribe( (response) => {

      this.dataObjects.next(this.convertOSMDataInChartData(response));

      this.options.next( {
        title: {
          text: ''
        },
        tooltip: {},
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
          {
            type: 'graph',
            layout: 'none',
            symbolSize: 20,
            roam: true,
            label: {
              show: true,
            },
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [4, 10],
            edgeLabel: {
              fontSize: 20,
            },
            data: this.dataObjects.value,
            links: this.dataLinks,
            lineStyle: {
              opacity: 0.9,
              width: 2,
              curveness: 0,
            }
          }
        ]
      });

      console.log(this.dataObjects.value);

      console.log("add new point");
      console.log("close connectionn");
    });
  }
  
  private errorHandler(error: HttpErrorResponse) {
    this.errorService.handle(error.message)
    return throwError(() => error.message)
  }

  private convertCityName(cityName : string) : string {
    const wordMap : any = {
      "Волгоград" : "Volgograd",
      "Москва" : "Moscow",
      "Воронеж" : "Voronezh",
      "Саратов" : "Saratov"
    };

    if(wordMap[cityName] !== undefined) {
        return wordMap[cityName]
    } else {
      return cityName
    }
     
  }

  private updateOptions() {
    
  }

  private convertOSMDataInChartData(response: any) : any {
      var ObjectDataOSM: any = Array();
      ObjectDataOSM = response["elements"];
      for(var i = 0; i < ObjectDataOSM.length; i++) {
        if(ObjectDataOSM[i]["type"] == "node") {
          ObjectDataOSM.splice(i,1);
          i--;
        }
      }

      console.log(ObjectDataOSM);

      var ObjectNameData: any = Array();
      for(var i = 0; i < ObjectDataOSM.length-1; i++) {
        if(ObjectDataOSM[i].hasOwnProperty('tags')) {
          if( ObjectDataOSM[i]["tags"].hasOwnProperty("addr:street") && ObjectDataOSM[i]["tags"].hasOwnProperty("addr:housenumber") && ObjectDataOSM[i]["tags"].hasOwnProperty("name")) {
            ObjectNameData.push(
              ObjectDataOSM[i]["tags"]["addr:street"] + " " + ObjectDataOSM[i]["tags"]["addr:housenumber"] + " - " + ObjectDataOSM[i]["tags"]["name"]
            );
          }
        }
      }

      console.log(ObjectNameData);

      for(var i = 0; i < ObjectNameData.length; i++) {
        console.log(ObjectNameData.indexOf(ObjectNameData[i]));
        if(ObjectNameData.indexOf(ObjectNameData[i]) != ObjectNameData.lastIndexOf(ObjectNameData[i])) {
          ObjectNameData.splice(ObjectNameData.lastIndexOf(ObjectNameData[i]), 1);
          i--;
          console.log("duplicate!!!");
        }
      }

      for(var i = 0; i < ObjectNameData.length; i++) {
        console.log(ObjectNameData[i]['name']);
      }

      console.log(ObjectNameData);

      var ObjectData = Array();
      for(var i = 0; i < ObjectNameData.length; i++) {
        ObjectData.push({
          name : ObjectNameData[i],
          x: Math.random() * (1000 - 0) + 0,
          y: Math.random() * (1000 - 0) + 0
        })
      }

      console.log(ObjectData);

      return ObjectData;
  };

}
