import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from '../shared/shared.module';
import { EnrolledCoursesComponent } from './components/enrolled-courses/enrolled-courses.component';
import { AboutUsComponent } from '../shared/components/about-us/about-us.component';
import { FeedbackDialogComponent } from './components/feedback/feedback-dialog.component';

@NgModule({
  declarations: [
    EnrolledCoursesComponent,
    AboutUsComponent,
    FeedbackDialogComponent,
  ],
  imports: [
    CommonModule, 
    UserRoutingModule,
    SharedModule,
  ],
})
export class UserModule {}