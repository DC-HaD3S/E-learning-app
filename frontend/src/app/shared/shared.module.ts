  import { NgModule } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { MatCardModule } from '@angular/material/card';
  import { MatButtonModule } from '@angular/material/button';
  import { MatDialogModule } from '@angular/material/dialog';
  import { MatSnackBarModule } from '@angular/material/snack-bar';
  import { MatFormFieldModule } from '@angular/material/form-field';
  import { MatInputModule } from '@angular/material/input';
  import { MatCheckboxModule } from '@angular/material/checkbox';
  import { FormsModule, ReactiveFormsModule } from '@angular/forms';
  import { DetailsCardComponent } from './details-card/details-card.component';
  import { CourseApplyDialogComponent } from '../components/course-apply-dialog/course-apply-dialog.component';

  @NgModule({
    declarations: [
      DetailsCardComponent,
      CourseApplyDialogComponent
    ],
    imports: [
      CommonModule,
      MatCardModule,
      MatButtonModule,
      MatDialogModule,
      MatSnackBarModule,
      MatFormFieldModule,
      MatInputModule,
      MatCheckboxModule,
      FormsModule,
      ReactiveFormsModule
    ],
    exports: [
      DetailsCardComponent,
      
      CourseApplyDialogComponent
    ]
  })
  export class SharedModule { }