import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, from, map, Observable, of, switchMap, take, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NewUser } from '../models/newUser.model';
import { Role, User } from '../models/user.model';
import { UserResponse } from '../models/userResponse.model';
import jwt_decode from 'jwt-decode';
import { GetResult, Preferences } from '@capacitor/preferences';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user$ = new BehaviorSubject<User>(null!);

  constructor(private http:HttpClient, private router:Router) { }


  private httpOptions: {headers: HttpHeaders} = {
    headers: new HttpHeaders({'Content-Type': 'application/json'}),
  };


  get isUserLoggedIn(): Observable<boolean>{
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        const isUserAuthenticated = user !== null;
        return of(isUserAuthenticated);
      })
    )
  }

  /*get userRole(): Observable<Role> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        return of(user?.role); // for after signed out, but still subscribed
      })
    );
  }*/

  register(newUser: NewUser): Observable<User>{

    return this.http.post<User>(
      `${environment.baseApiUrl}api/user/save`, newUser, this.httpOptions
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


  isTokenInStorage(): Observable<boolean | undefined | null> {
    return from(
      Preferences.get({
        key: 'token',
      })
    ).pipe(
      map((data: {value: string} | any) => {
        if (!data || !data.value) return null;

        const decodedToken: UserResponse = jwt_decode(data.value);
        const jwtExpirationInMsSinceUnixEpoch = decodedToken.exp * 1000;
        const isExpired =
          new Date() > new Date(jwtExpirationInMsSinceUnixEpoch);

        if (isExpired) return null;
        if (decodedToken.user) {
          this.user$.next(decodedToken.user);
          return true;
        }
        return null;
      })
    );
  }

  logout(): void {
    this.user$.next(null!);
    Preferences.remove({ key: 'token' });
    this.router.navigateByUrl('/auth');
  }

}
