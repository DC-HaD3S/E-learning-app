import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-instructor-list',
  templateUrl: './instructor-list.component.html',
  styleUrls: ['./instructor-list.component.css']
})
export class InstructorListComponent  {
  instructors = [
    { id: 1, name: 'Rajendra', email: 'Rajendra@gmail.com', qualifications: 'Bsc in CS', yearsOfExperience: 5 },
    { id: 2, name: 'Rajendra', email: 'Rajendra@gmail.com', qualifications: 'Bsc in CS', yearsOfExperience: 5 }
  ]; 


}