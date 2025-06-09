import { Component, OnInit } from '@angular/core';

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

  ngOnInit(): void {
      this.enrolledUsers = [
      {
        name: 'Rohit',
        email: 'rohit@gmail.com',
        username: 'rohitz',
        enrolledCourses: [
          { courseId: 1, courseName: 'Introduction to Angular' },
          { courseId: 5, courseName: 'Responsive Web Design' }
        ]
      },
      {
        name: 'Rohit',
        email: 'rohit@gmail.com',
        username: 'rohitz',
        enrolledCourses: [
          { courseId: 1, courseName: 'Introduction to Angular' },
          { courseId: 5, courseName: 'Responsive Web Design' }
        ]
      },
      {
        name: 'Rohit',
        email: 'rohit@gmail.com',
        username: 'rohitz',
        enrolledCourses: [
          { courseId: 1, courseName: 'Introduction to Angular' },
          { courseId: 5, courseName: 'Responsive Web Design' }
        ]
      },
      {
        name: 'Rohit',
        email: 'rohit@gmail.com',
        username: 'rohitz',
        enrolledCourses: [
          { courseId: 1, courseName: 'Introduction to Angular' },
          { courseId: 5, courseName: 'Responsive Web Design' }
        ]
      }
    ];
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