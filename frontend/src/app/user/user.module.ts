import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { FeedbackComponent } from '../components/feedback/feedback.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EnrolledCoursesComponent } from '../components/enrolled-courses/enrolled-courses.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { AboutUsComponent } from '../components/about-us/about-us.component';
@NgModule({
  declarations: [
    EnrolledCoursesComponent,
    AboutUsComponent,
    FeedbackComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    MatSelectModule,
    MatCardModule,
    MatGridListModule,
    
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