import { Router, RouterModule, RouterOutlet, RouterLinkActive } from '@angular/router';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-verification',
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterLinkActive, RouterModule],
    templateUrl: './verification.component.html',
})
export class VerificationComponent {
    constructor(private router: Router) {}

    loginForm():void {
        this.router.navigate(['/pulseSurvey/login']);
    }

    registerForm():void {
        this.router.navigate(['/pulseSurvey/register']);
    }
}
