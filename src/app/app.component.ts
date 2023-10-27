import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LeftNavComponent } from './navbar/left-nav/left-nav.component';
import { TopNavComponent } from './navbar/top-nav/top-nav.component';
import { MainContentComponent } from './main-content/main-content.component';

import { VerificationComponent } from './verification/verification.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, VerificationComponent,LeftNavComponent,TopNavComponent,MainContentComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'pulseSurvey';
}
