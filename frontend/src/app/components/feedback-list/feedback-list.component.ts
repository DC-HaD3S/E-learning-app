import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-feedback-list',
  templateUrl: './feedback-list.component.html',
  styleUrls: ['./feedback-list.component.css']
})
export class FeedbackListComponent implements OnInit {
  feedbacks = [
    { id: 1,name:'Rohit', coursename: 'Python', rating: 4, comments: 'Great course, very informative!' },
    { id: 2,name:'Rohit', coursename: 'JavaScript', rating: 5, comments: 'Loved the JavaScript basics.' }
  ]; 

  ngOnInit(): void {
    
  }
}