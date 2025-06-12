import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { ApplyInstructorComponent } from '../components/apply-instructor/apply-instructor.component';
import { FeedbackComponent } from '../components/feedback/feedback.component';
import { SharedModule } from '../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EnrolledCoursesComponent } from '../components/enrolled-courses/enrolled-courses.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';


import { MatDialogModule } from '@angular/material/dialog';
@NgModule({
  declarations: [
    ApplyInstructorComponent,
    EnrolledCoursesComponent,
    FeedbackComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatOptionModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class UserModule { }