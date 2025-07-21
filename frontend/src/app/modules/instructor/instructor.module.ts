import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTextareaModule } from '@angular/material/textarea';
import { MatTabsModule } from '@angular/material/tabs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { InstructorRoutingModule } from './instructor-routing.module';
import { InstructorProfileComponent } from './components/instructor-profile/instructor-profile.component';
import { InstructorEditProfileComponent } from './components/instructor-edit-profile/instructor-edit-profile.component';
import { InstructorCoursesComponent } from './components/instructor-courses/instructor-courses.component';

@NgModule({
  declarations: [
    InstructorProfileComponent,
    InstructorEditProfileComponent,
    InstructorCoursesComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatTextareaModule,
    MatTabsModule,
    FontAwesomeModule,
    InstructorRoutingModule
  ]
})
export class InstructorModule { }