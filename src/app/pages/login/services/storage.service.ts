import { Injectable } from '@angular/core';


const USER_KEY = 'auth-user';


@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  clean(): void {
    window.sessionStorage.clear();
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }

  public getUserId(): number | null {
    const user = window.sessionStorage.getItem(USER_KEY);
    
    if (user) {
      const userObject = JSON.parse(user);
      
      // Check if the 'id' property exists in the user object
      if (userObject && userObject.id) {
        return userObject.id;
      }
    }
    
    // Return null or an appropriate default value if 'id' is not found
    return null;
  }

  
  public isLoggedIn(): boolean {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return true;
    }

    return false;
  }
  
}
