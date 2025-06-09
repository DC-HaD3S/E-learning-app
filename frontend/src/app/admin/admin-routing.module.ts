import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { FeedbackListComponent } from '../components/feedback-list/feedback-list.component';
import { InstructorListComponent } from '../components/instructor-list/instructor-list.component';
import { AuthGuard } from '../guards/auth.guards';
import { EnrolledUsersComponent } from '../components/enrolled-users/enrolled-users.component';
import { ManageCoursesComponent } from '../components/manage-courses/manage-courses.component';
import { RegisteredUsersComponent } from '../components/registered-users/registered-users.component';

const routes: Routes = [
  { 
    path: '', 
    canActivate: [AuthGuard], 
    data: { role: 'admin' },
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'feedbacks', component: FeedbackListComponent },
      { path: 'instructors', component: InstructorListComponent },
      {path : 'manage-houses', component: ManageCoursesComponent},
      { path: 'enrolled', component: EnrolledUsersComponent },
      { path: 'registered-users', component: RegisteredUsersComponent }, 

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }