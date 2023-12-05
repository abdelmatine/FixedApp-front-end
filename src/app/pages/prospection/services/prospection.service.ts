import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, from, map, Observable, of, switchMap, take, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

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

  addProspection(userId:number | null, formData: any) {
    return this.http.post(`${environment.baseApiUrl}/api/Prospection/addProspection/${userId}`, formData);
  }

  getAllProspection() {
    return this.http.get(`${environment.baseApiUrl}/api/Prospection/getallprospections`);
  }

  searchProspection(attribute: string, query: string) {
    const url = `${environment.baseApiUrl}/api/Prospection/search?attribute=${attribute}&query=${query}`;
    return this.http.get(url);
  }

  searchProspectionBynumID(numID: number) {
    const url = `${environment.baseApiUrl}/api/Prospection/getProspectionBynumID?numID=${numID}`;
    return this.http.get(url);
  }

}


/*

  addProspection(formData: FormData): Observable<any> {
    return this.http.post<any>(`${environment.baseApiUrl}/SpringMVC/Prospection/addProspection`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

*/