import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-verification',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './verification.component.html',
})
export class VerificationComponent {
    constructor(private router: Router) {}

    loginForm() {
        this.router.navigate(['/pulseSurvey/login']);
    }

    registerForm() {
        this.router.navigate(['/pulseSurvey/register']);
    }
}
