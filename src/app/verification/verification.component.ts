import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent {

  constructor( private router:Router){}

  loginForm(){
    this.router.navigate(['/pulseSurvey/login']);
  }

  registerForm(){
    this.router.navigate(['/pulseSurvey/register']);
  }
}