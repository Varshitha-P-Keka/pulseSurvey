import { Routes } from '@angular/router';

import { HomeComponent, AdminComponent, SurveysComponent, SettingsComponent, MeSurveysComponent, OpenSurveysComponent, LaunchSurveyComponent, ClosedSurveysComponent, ActiveSurveysComponent, CompletedSurveysComponent, ViewSurveyComponent } from './home'
import { VerificationComponent, LoginEmployeeComponent, RegisterEmployeeComponent } from './verification'
import { AdminGuardService } from './shared/services/admin-guard.service';

export const routes: Routes = [
    { path: '', redirectTo: 'pulseSurvey', pathMatch: 'full' },
    { path: 'pulseSurvey', component: VerificationComponent },
    {
        path: 'pulseSurvey',
        children: [
            { path: 'register', component: RegisterEmployeeComponent },
            { path: 'login', component: LoginEmployeeComponent },
            {
                path: 'home',
                component: HomeComponent,
                children: [
                    {
                        path: '',
                        component: MeSurveysComponent,
                        children: [
                            { path: '', redirectTo: 'openSurveys', pathMatch: 'full' },
                            { path: 'openSurveys', component: OpenSurveysComponent },
                            { path: 'completedSurveys', component: CompletedSurveysComponent },
                        ],
                    },
                    {
                        path: 'admin',
                        component: AdminComponent, canActivate:[AdminGuardService],
                        children: [
                            { path: '', redirectTo: 'surveys', pathMatch: 'full' },
                            {
                                path: 'surveys',
                                component: SurveysComponent,
                                children: [
                                    { path: '', redirectTo: 'active', pathMatch: 'full' },
                                    { path: 'active', component: ActiveSurveysComponent,
                                     children: [{ path: 'launchNewSurvey', component: LaunchSurveyComponent }] 
                                    },
                                    {
                                        path: 'closed', 
                                        children: [
                                            { path: '', component: ClosedSurveysComponent },
                                            { path: 'view', component: ViewSurveyComponent },
                                        ],
                                    },
                                ],
                            },
                            { path: 'settings', component: SettingsComponent },
                        ],
                    },
                ],
            },
        ],
    },
];