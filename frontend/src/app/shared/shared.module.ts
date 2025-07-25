import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatOptionModule } from '@angular/material/core'; 
import { MatProgressBarModule } from '@angular/material/progress-bar'; 
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DetailsCardComponent } from './components/details-card/details-card.component';
import { CourseApplyDialogComponent } from '../modules/user/components/course-apply-dialog/course-apply-dialog.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { InstructorPageComponent } from './components/instructor-page/instructor-page.component';
import { AsyncFeedbackCountPipe } from './components/pipes/async-feedback-count';

@NgModule({
  declarations: [
    DetailsCardComponent,
    CourseApplyDialogComponent,
    InstructorPageComponent,
    AsyncFeedbackCountPipe,    
    ConfirmDialogComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    MatPaginatorModule,
    MatGridListModule,
    MatSelectModule,
    MatTableModule,
    MatSortModule,
    MatOptionModule,
    MatProgressBarModule, 
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    MatPaginatorModule,
    MatGridListModule,
    MatSelectModule,
    MatTableModule,
    MatSortModule,
    MatOptionModule,

    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    DetailsCardComponent,
    CourseApplyDialogComponent,
    ConfirmDialogComponent,
  ],
})
export class SharedModule {}