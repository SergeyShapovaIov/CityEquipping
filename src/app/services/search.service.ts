import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  // public cityName = new Subject();
  // cityName = 'Riga';
  constructor() {
      // this.cityName.next('Volgogard');
   }

  cityName : BehaviorSubject<string> = new BehaviorSubject<string>('Volgograd');

  cityName$: Observable<string> = this.cityName.asObservable();

  changeCity( city : string){
    
    // this.cit$.pipe(take(1)).subscribe((val) =>;
    this.cityName$.pipe(take(1)).subscribe((val) => {
        this.cityName.next(city);
    });
  }
}
