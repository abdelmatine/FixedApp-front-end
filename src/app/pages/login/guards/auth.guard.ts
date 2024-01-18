import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';

import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private storage: StorageService,
    private router: Router) {}

    
    canActivate(): boolean {
      if (this.storage.isLoggedIn()) {
        return true;
      } else {
        this.router.navigate(['/login']); // Redirect to login page if not logged in
        return false;
      }
    }
  
}