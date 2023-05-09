import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DetailProspection } from '../models/detailProspection.model';
import { ProspectionForm } from '../models/prospection.model';

@Injectable({
  providedIn: 'root'
})
export class ProspService {

  private usersUrl: string;

  private httpOptions: {headers: HttpHeaders} = {
    headers: new HttpHeaders({'Content-Type': 'application/json'}),
  };
  constructor(private http: HttpClient, private router: Router) { 
    this.usersUrl = 'http://localhost:8080/SpringMVC/Prospection/addProspection';

   }

   registerForm(prospection: ProspectionForm){
      return this.http.post<ProspectionForm>(
        this.usersUrl, 
        prospection, this.httpOptions
      );
   }


  public save(prosp: DetailProspection) {
    return this.http.post<DetailProspection>(this.usersUrl, prosp);
  }

  addProsp(prosp: DetailProspection): Observable<DetailProspection>{

    return this.http.post<DetailProspection>(
      `${environment.baseApiUrl}SpringMVC/Prospection/addProspection`, prosp, this.httpOptions)
      ;
  }



}
