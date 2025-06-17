import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { FeedbackComponent } from '../components/feedback/feedback.component';
import { AuthGuard } from '../guards/auth.guards';
import { EnrolledCoursesComponent } from '../components/enrolled-courses/enrolled-courses.component';
import { AboutUsComponent } from '../components/about-us/about-us.component';
import { CourseDetailsComponent } from '../components/course-details-dialog/course-details-dialog.component';
const routes: Routes = [
  { 
    path: '', 
    canActivate: [AuthGuard], 
    data: { role: 'user' },
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'enrolled', component: EnrolledCoursesComponent },
      { path: 'feedback', component: FeedbackComponent },
      {path : 'about-us', component: AboutUsComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }