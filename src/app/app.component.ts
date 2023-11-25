import { Component, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { VerificationComponent } from './verification/verification.component';
import { UpdateTemplateComponent } from './home/admin/settings/update-template/update-template.component';
import { UserDataService } from './shared/services/user-data.service';
import { LoaderComponent } from './shared/loader/loader.component';
import { NgHttpLoaderModule } from 'ng-http-loader';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, VerificationComponent,UpdateTemplateComponent,NgHttpLoaderModule],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'pulseSurvey';
  public LoaderComponent = LoaderComponent;
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
