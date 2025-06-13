import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface InstructorApplication {
    id?: number;

  name: string;
  email: string;
  qualifications: string;
  experience: number;
  courses?: string;
}


@Injectable({
  providedIn: 'root'
})
export class InstructorService {
  private apiUrl = 'http://localhost:8084/instructor';

  constructor(private http: HttpClient) {}
applyAsInstructor(application: InstructorApplication, username: string) {
  const params = { username };
  return this.http.post(`${this.apiUrl}/apply`, application, { params });
}
  getAllApplications(): Observable<InstructorApplication[]> {
    return this.http.get<InstructorApplication[]>(`${this.apiUrl}/applications`);
  }
}