import { Injectable } from '@angular/core';
import { ProspectionForm } from '../models/prospection.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, from, map, Observable, of, switchMap, take, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProspectionServiceService {


  //private prospection$ = new BehaviorSubject<ProspectionForm>(null!);

  constructor(private http:HttpClient) { }


  private httpOptions: {headers: HttpHeaders} = {
    headers: new HttpHeaders({'Content-Type': 'application/json'}),
  };


  addProsp(prosp: ProspectionForm): Observable<ProspectionForm>{

    return this.http.post<ProspectionForm>(
      `${environment.baseApiUrl}api/user/save`, prosp, this.httpOptions
    ).pipe(take(1));
  }

}
