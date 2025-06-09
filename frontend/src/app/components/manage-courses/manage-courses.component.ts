import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { Course } from 'src/app/models/course.model';
import { loadCourses, loadCoursesFailure } from 'src/app/state/course.actions';
import { Observable } from 'rxjs';
import { CourseService } from 'src/app/services/course.service';
import { selectCourses, selectCourseError } from 'src/app/state/course.selectors';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

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
  newCourse: Course = { id: 0, title: '', body: '', imageUrl: '', price: 0, enrolledUsers: [] };
  editingCourse: Course | null = null;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('addCourseDialog') addCourseDialog!: TemplateRef<any>;
  @ViewChild('editCourseDialog') editCourseDialog!: TemplateRef<any>;

  constructor(
    private store: Store<AppState>,
    private courseService: CourseService,
    private dialog: MatDialog
  ) {
    this.courses$ = this.store.select(selectCourses);
    this.error$ = this.store.select(selectCourseError);
  }

  ngOnInit() {
    this.store.dispatch(loadCourses());
    this.courses$.subscribe(courses => {
      this.dataSource.data = courses;
      this.dataSource.sort = this.sort;
    });
  }

  openAddCourseDialog() {
    this.newCourse = { id: 0, title: '', body: '', imageUrl: '', price: 0, enrolledUsers: [] };
    this.dialog.open(this.addCourseDialog, {
      width: '800px',
      maxWidth: '95vw',
      panelClass: 'custom-dialog'
    });
  }

  addCourse() {
    this.courseService.addCourse(this.newCourse).subscribe({
      next: () => {
        this.store.dispatch(loadCourses());
        this.newCourse = { id: 0, title: '', body: '', imageUrl: '', price: 0, enrolledUsers: [] };
        this.dialog.closeAll();
      },
      error: (err) => this.store.dispatch(loadCoursesFailure({ error: err.message }))
    });
  }

  openEditCourseDialog(course: Course) {
    this.editingCourse = { ...course };
    this.dialog.open(this.editCourseDialog, {
      width: '800px',
      maxWidth: '95vw',
      panelClass: 'custom-dialog'
    });
  }

  updateCourse() {
    if (this.editingCourse) {
      this.courseService.updateCourse(this.editingCourse).subscribe({
        next: () => {
          this.store.dispatch(loadCourses());
          this.editingCourse = null;
          this.dialog.closeAll();
        },
        error: (err) => this.store.dispatch(loadCoursesFailure({ error: err.message }))
      });
    }
  }

  cancelEdit() {
    this.editingCourse = null;
    this.dialog.closeAll();
  }

  deleteCourse(courseId: number) {
    this.courseService.deleteCourse(courseId).subscribe({
      next: () => this.store.dispatch(loadCourses()),
      error: (err) => this.store.dispatch(loadCoursesFailure({ error: err.message }))
    });
  }
}