import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { ApplyInstructorComponent } from '../components/apply-instructor/apply-instructor.component';
import { FeedbackComponent } from '../components/feedback/feedback.component';
import { AuthGuard } from '../guards/auth.guards';
import { EnrolledCoursesComponent } from '../components/enrolled-courses/enrolled-courses.component';

const routes: Routes = [
  { 
    path: '', 
    canActivate: [AuthGuard], 
    data: { role: 'user' },
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'enrolled', component: EnrolledCoursesComponent },
      { path: 'apply-instructor', component: ApplyInstructorComponent },
      { path: 'feedback', component: FeedbackComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }