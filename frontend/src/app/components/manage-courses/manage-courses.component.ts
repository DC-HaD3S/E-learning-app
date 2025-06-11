import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Course } from 'src/app/models/course.model';
import { CourseService } from 'src/app/services/course.service';
import {
  loadCourses,
  addCourse,
  updateCourse,
  deleteCourse,
  clearCourseError
} from 'src/app/state/course.actions';
import {
  selectCourses,
  selectCourseError
} from 'src/app/state/course.selectors';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/state/app.state';

@Component({
  selector: 'app-manage-courses',
  templateUrl: './manage-courses.component.html',
  styleUrls: ['./manage-courses.component.css']
})
export class ManageCoursesComponent implements OnInit {
  courses$: Observable<Course[]>;
  error$: Observable<string | null>;
  dataSource = new MatTableDataSource<Course>();
  displayedColumns: string[] = ['title', 'body', 'imageUrl', 'price', 'actions'];
  newCourse: Course = { id: 0, title: '', body: '', imageUrl: '', price: 0 };
  editedCourse: Course | null = null;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('addCourseDialog') addCourseDialog!: TemplateRef<any>;
  @ViewChild('editCourseDialog') editCourseDialog!: TemplateRef<any>;

  lastCoursesLength = 0;
  pendingAction: 'add' | 'update' | 'delete' | null = null;

  constructor(
    private store: Store<AppState>,
    private courseService: CourseService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.courses$ = this.store.select(selectCourses);
    this.error$ = this.store.select(selectCourseError);
  }

  ngOnInit(): void {
    this.store.dispatch(loadCourses());

    this.courses$.subscribe(courses => {
      this.dataSource.data = courses;
      this.dataSource.sort = this.sort;

      // Success Snackbar Logic
      if (this.pendingAction) {
        if (this.pendingAction === 'add' && courses.length > this.lastCoursesLength) {
          this.snackBar.open('Course successfully added!', 'Close', { duration: 3000 });
        } else if (this.pendingAction === 'delete' && courses.length < this.lastCoursesLength) {
          this.snackBar.open('Course successfully deleted!', 'Close', { duration: 3000 });
        } else if (this.pendingAction === 'update') {
          this.snackBar.open('Course successfully updated!', 'Close', { duration: 3000 });
        }
        this.pendingAction = null;
      }

      this.lastCoursesLength = courses.length;
    });

    this.error$.subscribe(error => {
      if (error) {
        this.snackBar.open(`Error: ${error}`, 'Close', { duration: 5000 });
        setTimeout(() => this.store.dispatch(clearCourseError()), 5000);
        this.pendingAction = null; 
      }
    });
  }

  openAddCourseDialog(): void {
    this.newCourse = { id: 0, title: '', body: '', imageUrl: '', price: 0 };
    this.dialog.open(this.addCourseDialog);
  }

  addCourse(): void {
    if (this.newCourse.title && this.newCourse.body && this.newCourse.price != null) {
      this.pendingAction = 'add';
      this.store.dispatch(addCourse({ course: { ...this.newCourse } }));
      this.dialog.closeAll();
    }
  }

  openEditCourseDialog(course: Course): void {
    this.editedCourse = { ...course };
    this.dialog.open(this.editCourseDialog);
  }

  updateCourse(): void {
    if (this.editedCourse) {
      this.pendingAction = 'update';
      this.store.dispatch(updateCourse({ course: this.editedCourse }));
      this.dialog.closeAll();
    }
  }

  deleteCourse(courseId: number): void {
    this.pendingAction = 'delete';
    this.store.dispatch(deleteCourse({ courseId }));
  }

  cancelEdit(): void {
    this.editedCourse = null;
    this.dialog.closeAll();
  }
}
