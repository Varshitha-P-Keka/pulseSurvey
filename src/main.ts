import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { DatePipe } from '@angular/common';
import {provideHttpClient} from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import {BsModalService} from 'ngx-bootstrap/modal';

bootstrapApplication(AppComponent, {providers:[provideHttpClient(),provideRouter(routes),DatePipe,BsModalService]})
  .catch((err) => console.error(err));
