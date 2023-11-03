import { Routes } from '@angular/router';
import { VerificationComponent } from './verification/verification.component';
import { RegisterEmployeeComponent } from './register-employee/register-employee.component';
import { LoginEmployeeComponent } from './login-employee/login-employee.component';
import { HomeComponent } from './home/home.component';
import { OpenSurveysComponent } from './me-profile/open-surveys/open-surveys.component';
import { DetailsComponent } from './me-profile/open-surveys/details/details.component';
import { CompletedSurveysComponent } from './me-profile/completed-surveys/completed-surveys.component';

export const routes: Routes = [
    { path: '', redirectTo: 'pulseSurvey', pathMatch: 'full' },
    { path: 'pulseSurvey', component: VerificationComponent},
    { path: 'pulseSurvey',
    
        children: [
            { path: 'register', component: RegisterEmployeeComponent },
            { path: 'login', component: LoginEmployeeComponent },
            { path: 'home', component:HomeComponent,

                children:[
                    {path: 'openSurveys', component:OpenSurveysComponent

                        // children:[

                        //     {path:'details',component:DetailsComponent}
                        // ]   
                },
                    {path: 'completedSurveys',component:CompletedSurveysComponent}
                ]
            }
        ],
    },
];
