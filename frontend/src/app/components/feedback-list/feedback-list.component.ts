import { Component, OnInit } from '@angular/core';
import { FeedbackService } from 'src/app/services/feedback.service';
import { Feedback } from 'src/app/models/feedback.model';

@Component({
  selector: 'app-feedback-list',
  templateUrl: './feedback-list.component.html',
  styleUrls: ['./feedback-list.component.css']
})
export class FeedbackListComponent implements OnInit {
  feedbacks: Feedback[] = [];

  constructor(private feedbackService: FeedbackService) {}

  ngOnInit(): void {
    this.feedbackService.getAllFeedbacks().subscribe({
      next: (data) => {
        this.feedbacks = data;
      },
      error: (err) => {
        console.error('Failed to fetch feedbacks:', err);
      }
    });
  }

  sortFeedbacksFromEvent(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    if (!selectedValue) return;

    const [field, direction] = selectedValue.split(':');

    if (!field || !direction) {
      console.warn('Invalid sort option selected');
      return;
    }

    this.sortFeedbacks(field, direction as 'asc' | 'desc');
  }

  sortFeedbacks(field: string, direction: 'asc' | 'desc'): void {
    this.feedbacks.sort((a, b) => {
      const aValue = a[field as keyof Feedback];
      const bValue = b[field as keyof Feedback];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return direction === 'asc' ? comparison : -comparison;
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }
}
