import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { DatePipe } from '@angular/common';
import {provideHttpClient} from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
// <<<<<<< master
import { provideAnimations } from '@angular/platform-browser/animations';
import {BsModalService} from 'ngx-bootstrap/modal';

bootstrapApplication(AppComponent, {providers:[provideHttpClient(), provideAnimations(),provideRouter(routes),DatePipe,BsModalService]})  .catch((err) => console.error(err));
// =======


// bootstrapApplication(AppComponent, {providers:[provideHttpClient(),provideRouter(routes),DatePipe,BsModalService]})
// >>>>>>> master

