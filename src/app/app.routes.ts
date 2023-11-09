import { Routes } from '@angular/router';
import { VerificationComponent } from './verification/verification.component';
import { RegisterEmployeeComponent } from './register-employee/register-employee.component';
import { LoginEmployeeComponent } from './login-employee/login-employee.component';
import { HomeComponent } from './home/home.component';
import { MeComponent } from './me/me.component';
import { AdminComponent } from './admin/admin.component';
import { SurveysComponent } from './admin/surveys/surveys.component';
import { SettingsComponent } from './admin/settings/settings.component';
import { ActiveSurveysComponent } from './admin/surveys/active-surveys/active-surveys.component';
import { ClosedSurveysComponent } from './admin/surveys/closed-surveys/closed-surveys.component';
import { LaunchSurveyComponent } from './admin-modals/launch-survey/launch-survey.component';
import { CloseSurveyComponent } from './admin-modals/close-survey/close-survey.component';
import { UpdateSurveyComponent } from './admin-modals/update-survey/update-survey.component';
import { OpenSurveysComponent } from './me-profile/open-surveys/open-surveys.component';
import { DetailsComponent } from './me-profile/open-surveys/details/details.component';
import { CompletedSurveysComponent } from './me-profile/completed-surveys/completed-surveys.component';
import { ViewSurveyComponent } from './admin/surveys/closed-surveys/view-survey/view-survey.component';
import { ClosedSurveysPageComponent } from './closed-surveys-page/closed-surveys-page.component';
import { Component } from '@angular/core';

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
                    { path: 'openSurveys', component: OpenSurveysComponent },
                    { path: 'completedSurveys', component: CompletedSurveysComponent },
                    { path: 'Me', component: MeComponent },
                    {
                        path: 'Admin',
                        component: AdminComponent,
                        children: [
                            {
                                path: 'surveys',
                                component: SurveysComponent,
                                children: [
                                    {
                                        path: 'active',
                                        component: ActiveSurveysComponent,
                                        children: [
                                            { path: 'updateSurvey', component: UpdateSurveyComponent },
                                            { path: 'closeSurveys', component: CloseSurveyComponent },
                                            { path: 'LaunchNewSurvey', component: LaunchSurveyComponent },
                                        ],
                                    },

                                    {
                                        path: 'closed',
                                        component: ClosedSurveysPageComponent,
                                        children: [
                                            { path: '', component: ClosedSurveysComponent },
                                            { path: 'view', component: ViewSurveyComponent },
                                        ],
                                    },
                                    { path: 'closed', children: [{ path: 'view', component: ViewSurveyComponent }] },
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
