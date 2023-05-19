import { Injectable } from '@angular/core';
import { ProspectionForm } from '../models/prospection.model';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, from, map, Observable, of, switchMap, take, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';



//////////////////////////////////

const baseUrl = 'https://localhost:8080/SpringMVC/Prospection';

@Injectable({
  providedIn: 'root'
})
export class ProspectionService {



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


  deleteProspection(id: number): Observable<any> {
    const url = `${environment.baseApiUrl}/Prospection/deleteProspection/${id}`;
    return this.http.delete(url).pipe(
      tap(_ => console.log(`deleted prospection id=${id}`)),
    );
  }


  findByTitle(fullName: any): Observable<ProspectionForm[]> {
    return this.http.get<ProspectionForm[]>(`${baseUrl}?title=${fullName}`);
  }


}
