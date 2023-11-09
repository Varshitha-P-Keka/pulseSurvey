import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { DatePipe } from '@angular/common';
import {provideHttpClient} from '@angular/common/http';
import "@angular/compiler";

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

import { provideAnimations } from '@angular/platform-browser/animations';
import {BsModalService} from 'ngx-bootstrap/modal';
import { NgxDatesPickerModule } from 'ngx-dates-picker';
import { importProvidersFrom } from '@angular/core';


// bootstrapApplication(AppComponent, {providers:[provideHttpClient(), provideAnimations(),provideRouter(routes),DatePipe,BsModalService,importProvidersFrom(NgxDatesPickerModule)]})  .catch((err) => console.error(err));


bootstrapApplication(AppComponent, { providers: [provideHttpClient(), provideAnimations(), provideRouter(routes), DatePipe, BsModalService] }).catch((err) => console.error(err));