import { Component, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { VerificationComponent } from './verification/verification.component';
import { UpdateTemplateComponent } from './admin/settings/update-template/update-template.component';
import { UserDataService } from './services/user-data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, VerificationComponent,UpdateTemplateComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'pulseSurvey';

  constructor(private behaviorSubjectService: UserDataService, private renderer: Renderer2){
  }

  ngOnInit(){
    this.behaviorSubjectService.getTheme().subscribe({
      next: (data)=>{
        if(data=='dark-theme'){
          this.renderer.setAttribute(document.body,'class','dark-theme');
        }
        else{
          this.renderer.setAttribute(document.body,'class','light-theme')
        }
      }
    })
  }
}
