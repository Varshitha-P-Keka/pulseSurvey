import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { DatePipe } from '@angular/common';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TokenInterceptorService } from './app/services/token-interceptor.service';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import {BsModalService} from 'ngx-bootstrap/modal';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AdminGuardService } from './app/services/admin-guard.service';
import { AdminAuthenticationService } from './app/services/admin-authentication.service';

bootstrapApplication(AppComponent, { providers: [ provideHttpClient(),{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true }, AdminGuardService,AdminAuthenticationService,provideToastr(), provideAnimations(), provideRouter(routes), DatePipe, BsModalService,ToastrService] }).catch((err) => {
    return console.error(err);
});