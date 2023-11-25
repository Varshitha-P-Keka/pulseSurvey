import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { TopNavComponent } from './top-nav/top-nav.component';
import { LeftNavComponent } from './left-nav/left-nav.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, LeftNavComponent, TopNavComponent, RouterOutlet],
    templateUrl: './home.component.html',
})

export class HomeComponent {}