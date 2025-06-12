import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
  enrolledUsers: EnrolledUser[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<RawEnrollment[]>('http://localhost:8084/admin/enrolled').subscribe({
      next: (data) => {
        this.enrolledUsers = this.groupEnrollmentsByUser(data);
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
          name: enrollment.username, // fallback if no full name
          email: `${enrollment.username}@example.com`, // dummy email format
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

  getUserDetails(user: EnrolledUser): string[] {
    const baseDetails = [
      'Email: ' + user.email,
      'Username: ' + user.username,
      user.enrolledCourses.length > 0 ? 'Enrolled Courses:' : 'No courses enrolled'
    ];
    const courseDetails = user.enrolledCourses.map(
      course => 'Course ID: ' + course.courseId + ' - ' + course.courseName
    );
    return [...baseDetails, ...courseDetails]; 
  }
}
