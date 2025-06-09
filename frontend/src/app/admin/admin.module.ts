import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { FeedbackListComponent } from '../components/feedback-list/feedback-list.component';
import { InstructorListComponent } from '../components/instructor-list/instructor-list.component';
import { SharedModule } from '../shared/shared.module';
import { DetailsCardComponent } from '../shared/details-card/details-card.component';
import { RegisteredUsersComponent } from '../components/registered-users/registered-users.component';
import { EnrolledUsersComponent } from '../components/enrolled-users/enrolled-users.component';

@NgModule({
  declarations: [
    FeedbackListComponent,
    InstructorListComponent,
    RegisteredUsersComponent,
    EnrolledUsersComponent
   


  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ]
})
export class AdminModule { }