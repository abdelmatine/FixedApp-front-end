import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SousTraitantService {

  constructor(private http:HttpClient) { }

  private httpOptions: {headers: HttpHeaders} = {
    headers: new HttpHeaders({'Content-Type': 'application/json'}),
  };

  addDateDemandeinter(formData: any) {
    return this.http.post(`${environment.baseApiUrl}/DemandeInter/addDateDemandeInter`, formData);
  }

  getAllDemandeinter() {
    return this.http.get(`${environment.baseApiUrl}/DemandeInter/retrieveallDemandeInter`);
  }

  searchDemandeinter(attribute: string, query: string) {
    const url = `${environment.baseApiUrl}/DemandeInter/search?attribute=${attribute}&query=${query}`;
    return this.http.get(url);
  }

}
