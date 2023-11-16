import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { DatePipe } from '@angular/common';
import {provideHttpClient} from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import {BsModalService} from 'ngx-bootstrap/modal';
import { ToastrModule, ToastrService } from 'ngx-toastr';

// ToastrModule.forRoot({
//     timeOut: 1000,
//     positionClass: 'toast-bottom-right'
//   })
//   {timeOut: 1000,positionClass: 'toast-bottom-right'}

bootstrapApplication(AppComponent, { providers: [provideHttpClient(), provideToastr(), provideAnimations(), provideRouter(routes), DatePipe, BsModalService,ToastrService] }).catch((err) => console.error(err));