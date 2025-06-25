import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnrolledCoursesComponent } from './components/enrolled-courses/enrolled-courses.component';
import { AboutUsComponent } from '../shared/components/about-us/about-us.component';
import { FeedbackDialogComponent } from './components/feedback/feedback-dialog.component';
import { AuthGuard } from '../guards/auth.guards';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: { role: 'user' },
    children: [
      { path: '', redirectTo: 'enrolled', pathMatch: 'full' }, 
      { path: 'enrolled', component: EnrolledCoursesComponent },
      { path: 'about-us', component: AboutUsComponent },
      { path: 'feedback', component: FeedbackDialogComponent }, 
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}