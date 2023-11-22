import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {
  constructor(){
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    let token= JSON.parse(<string>localStorage.getItem('token'));
    let tokenHeader = req.clone({
      setHeaders:{
        Authorization: "Bearer "+token.token,
      }
    })
    return next.handle(tokenHeader);
  }
}
