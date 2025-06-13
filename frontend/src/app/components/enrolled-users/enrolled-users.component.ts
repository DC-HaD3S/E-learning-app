import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort'; // <-- Add this

interface RawEnrollment {
  username: string;
  courseId: number;
  courseName: string;
}

interface EnrolledUser {
  name: string;
  email: string;
  username: string;
  enrolledCourses: { courseId: number; courseName: string }[];
}

@Component({
  selector: 'app-enrolled-users',
  templateUrl: './enrolled-users.component.html',
  styleUrls: ['./enrolled-users.component.css']
})
export class EnrolledUsersComponent implements OnInit {
  displayedColumns: string[] = ['username', 'email', 'courses'];
  dataSource = new MatTableDataSource<EnrolledUser>();

  @ViewChild(MatSort) sort!: MatSort; // <-- ViewChild for sorting

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<RawEnrollment[]>('http://localhost:8084/admin/enrolled').subscribe({
      next: (data) => {
        this.dataSource.data = this.groupEnrollmentsByUser(data);
        this.dataSource.sort = this.sort; // <-- Connect sort after data is set
      },
      error: () => {
        console.error('Failed to load enrolled users');
      }
    });
  }

  groupEnrollmentsByUser(data: RawEnrollment[]): EnrolledUser[] {
    const userMap: { [username: string]: EnrolledUser } = {};

    data.forEach((enrollment) => {
      if (!userMap[enrollment.username]) {
        userMap[enrollment.username] = {
          name: enrollment.username,
          email: `${enrollment.username}@example.com`,
          username: enrollment.username,
          enrolledCourses: []
        };
      }
      userMap[enrollment.username].enrolledCourses.push({
        courseId: enrollment.courseId,
        courseName: enrollment.courseName
      });
    });

    return Object.values(userMap);
  }
}
