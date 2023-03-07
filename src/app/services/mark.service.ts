import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarkService {

  public mark: BehaviorSubject<number> = new BehaviorSubject<number>(7.2);

  constructor() { }

  getMarkByDataObjetsAndPopulation(dataObjects: any,population : number) : number {
    console.log(population);
    console.log(dataObjects);
    console.log(dataObjects.length*80000 / population);
    return dataObjects.length*80000 / population;
  }
}
