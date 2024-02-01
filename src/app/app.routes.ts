import { Routes } from '@angular/router';
import { Qualification } from './Qualification';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { authGuardGuard } from './auth-guard.guard';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeDetailComponent } from "./employee-detail/employee-detail.component";
import { EmployeeSearchResultComponent } from "./employee-search-result/employee-search-result.component";
import {QualificationsComponent} from "./qualifications/qualifications.component";

export const routes: Routes = [
  { path: "", component: LandingPageComponent },
  {
    path: "qualifications",
    title: "Qualifikationen",
    component: QualificationsComponent,
    canActivate: [authGuardGuard],
  },
  {
    path: "employees",
    title: "Mitarbeiter",
    component: EmployeeListComponent,
    canActivate: [authGuardGuard],
  },
  {
    path: 'detail/:id',
    title: 'Mitarbeiter Informationen',
    component: EmployeeDetailComponent,
    canActivate: [authGuardGuard],
  },
  /*{
    path: 'create',
    title: 'Mitarbeiter erstellen',
    component: EmployeeCreateComponent,
    canActivate: [authGuardGuard],
  }*/
  {
    path: "searchEmployees",
    component: EmployeeSearchResultComponent,
    canActivate: [authGuardGuard],
  },
];
