import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminAuthenticationService } from './admin-authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuardService{
  constructor( private router: Router, private adminAuthentication: AdminAuthenticationService) {
   }

  canActivate(): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree>{
    if(this.adminAuthentication.isAuthenticated()){
      return true;
    }
    else{
      this.router.navigate(['pulseSurvey/home/openSurveys']);
      return false;
    }
  }
}

