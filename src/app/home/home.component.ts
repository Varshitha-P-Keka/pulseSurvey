import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, RouterLink } from '@angular/router';

import { TopNavComponent } from '../navbar/top-nav/top-nav.component';
import { LeftNavComponent } from '../navbar/left-nav/left-nav.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, LeftNavComponent, TopNavComponent, RouterOutlet, RouterLink],
    templateUrl: './home.component.html',
})
export class HomeComponent {
    constructor( public router: Router) {}
}
