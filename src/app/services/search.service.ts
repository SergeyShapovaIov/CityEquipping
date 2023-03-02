import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor() {
   }

  cityName : BehaviorSubject<string> = new BehaviorSubject<string>('Volgograd');

  cityName$: Observable<string> = this.cityName.asObservable();

  changeCity( city : string){
    this.cityName$.pipe(take(1)).subscribe((val) => {
        this.cityName.next(city);
    });
  }
}
22