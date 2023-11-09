import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { VerificationComponent } from './verification/verification.component';
import { UpdateTemplateComponent } from './admin/settings/update-template/update-template.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, VerificationComponent,UpdateTemplateComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'pulseSurvey';
}
