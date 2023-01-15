import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {City} from "../entity/city";
import {catchError, Observable, retry, throwError} from "rxjs";
import {ErrorService} from "./error.service";

@Injectable({
  providedIn: 'root'
})
export class PeopleService {

  constructor(
    private http: HttpClient,
    private errorService: ErrorService
  ) { }

  getCityByName(name: string): Observable<City> {
    return this.http.get<City>('https://api.api-ninjas.com/v1/city?name='.concat(name), {
      headers: {
        'X-Api-Key': 'VOtTuiAMf9PVpyk/eBgXEA==Lb8TN3LHVNQlqbVN'
      }
    }).pipe(
      retry(3),
      catchError(this.errorHandler.bind(this))
    )
  }

  private errorHandler(error: HttpErrorResponse) {
    this.errorService.handle(error.message)
    return throwError(() => error.message)
  }
}
