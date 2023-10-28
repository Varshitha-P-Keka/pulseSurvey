import { Routes } from '@angular/router';
import { VerificationComponent } from './verification/verification.component';
import { RegisterEmployeeComponent } from './register-employee/register-employee.component';
import { LoginEmployeeComponent } from './login-employee/login-employee.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MainContentComponent } from './main-content/main-content.component';
import { CompletedSurveysComponent } from './completed-surveys/completed-surveys.component';
import { MeComponent } from './me/me.component';
import { AdminComponent } from './admin/admin.component';

export const routes: Routes = [
    { path: '', redirectTo: 'pulseSurvey', pathMatch: 'full' },
    { path: 'pulseSurvey', component: VerificationComponent },
    {
        path: 'pulseSurvey',
        children: [
            { path: 'register', component: RegisterEmployeeComponent },
            { path: 'login', component: LoginEmployeeComponent },
            { path: 'home', component:HomeComponent},
            {
                path:'home',
                children: [
                    {path: 'Me', component: MeComponent},
                    {
                        path: 'Me',
                        children: [
                            {path: 'openSurveys',component:MeComponent},
                            {path: 'completedSurveys', component:MeComponent}

                        ]
                    },
                    {path: 'Admin', component: AdminComponent},
                    {
                        path: 'Admin',
                        children: [
                            {path: 'surveys', component: AdminComponent},
                            {
                                path:'surveys',
                                children:[
                                    {path:'active',component:AdminComponent},
                                    {path:'closed',component:AdminComponent}

                                ]
                            },
                            {path: 'settings', component: AdminComponent}
                        ]
                    }
                   
                ]
            }            
        ],
    },
];
