import { Component, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
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

  constructor(private udService: UserDataService, private renderer: Renderer2){

  }

  ngOnInit(){
    this.udService.getTheme().subscribe({
      next: (data)=>{
        console.log(data);
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
