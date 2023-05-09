import { Injectable } from '@angular/core';
import { ProspectionForm } from '../models/prospection.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, from, map, Observable, of, switchMap, take } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';



//////////////////////////////////



@Injectable({
  providedIn: 'root'
})
export class ProspectionServiceService {



  //formData: any = {};

  //private prospection$ = new BehaviorSubject<ProspectionForm>(null!);

  constructor(private http:HttpClient) { }


  private httpOptions: {headers: HttpHeaders} = {
    headers: new HttpHeaders({'Content-Type': 'application/json'}),
  };


  addProsp(prosp: ProspectionForm): Observable<ProspectionForm>{

    return this.http.post<ProspectionForm>(
      `${environment.baseApiUrl}/SpringMVC/Prospection/addProspection`, prosp, this.httpOptions)
      .pipe(take(1));
  }


  sendFormData(formData: any) {
    return this.http.post(`${environment.baseApiUrl}/SpringMVC/Prospection/addProspection`, formData);
  }


  ///latest

  addProspection(formData: FormData): Observable<any> {
    return this.http.post<any>(`${environment.baseApiUrl}/SpringMVC/Prospection/addProspection`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

}
