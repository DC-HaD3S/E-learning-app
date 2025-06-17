import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
import { FeedbackListComponent } from '../components/feedback-list/feedback-list.component';
import { RegisteredUsersComponent } from '../components/registered-users/registered-users.component';
import { EnrolledUsersComponent } from '../components/enrolled-users/enrolled-users.component';
import { ManageCoursesComponent } from '../components/manage-courses/manage-courses.component';

@NgModule({
  declarations: [
    FeedbackListComponent,
    RegisteredUsersComponent,
    EnrolledUsersComponent,
    ManageCoursesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    AdminRoutingModule,
    SharedModule
  ]
})
export class AdminModule { }