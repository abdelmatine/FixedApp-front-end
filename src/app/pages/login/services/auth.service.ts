import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, switchMap, take, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NewUser } from '../models/newUser.model';
import { User } from '../models/user.model';
import { UserResponse } from '../models/userResponse.model';
import jwt_decode from 'jwt-decode';
import { Preferences } from '@capacitor/preferences';
import { off } from 'process';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user$ = new BehaviorSubject<User>({ id: '', firstName: '', userName: '', lastName: '', role: 'user' });


  private httpOptions: {headers: HttpHeaders} = {
    headers: new HttpHeaders({'Content-Type': 'application/json'}),
  };



  constructor(private http:HttpClient, private router:Router) { }

  register(newUser: NewUser): Observable<User>{

    return this.http.post<User>(
      `${environment.baseApiUrl}/login/register`, newUser, this.httpOptions
    ).pipe(take(1));
  }


  login(userName: string, password: string): Observable<{ token: string }>{
    
    return this.http
    .post<{token: string}>(
      `${environment.baseApiUrl}/login/signin`, 
      {userName, password}, 
      this.httpOptions
    )
    .pipe(take(1),
    tap((response: {token: string}) => {
      Preferences.set({
        key: 'token',
        value: response.token,
      });
      const decodedToken: UserResponse = jwt_decode(response.token);
      this.user$.next(decodedToken.user);
    })
    );
  
  }
}
