import { Component, Input, OnInit } from '@angular/core';
import { CourseContent } from '../../models/course-content.model';
import { CourseContentService } from '../../services/course-content.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-course-content-viewer',
  templateUrl: './course-content-viewer.component.html',
  styleUrls: ['./course-content-viewer.component.css']
})
export class CourseContentViewerComponent implements OnInit {
  @Input() courseId!: number;
  @Input() isEnrolled: boolean = false;
  
  courseContent: CourseContent[] = [];
  isLoading = false;
  expandedTopics: Set<number> = new Set();

  constructor(
    private courseContentService: CourseContentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (this.courseId) {
      this.loadCourseContent();
    }
  }

  loadCourseContent(): void {
    this.isLoading = true;
    this.courseContentService.getCourseContent(this.courseId).subscribe({
      next: (content) => {
        this.courseContent = content;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading course content:', error);
        this.snackBar.open('Failed to load course content', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  toggleTopic(topicId: number): void {
    if (this.expandedTopics.has(topicId)) {
      this.expandedTopics.delete(topicId);
    } else {
      this.expandedTopics.add(topicId);
    }
  }

  isTopicExpanded(topicId: number): boolean {
    return this.expandedTopics.has(topicId);
  }

  onSubtopicClick(subtopic: any): void {
    if (this.isEnrolled && subtopic.url) {
      // Open the URL in a new tab/window
      window.open(subtopic.url, '_blank');
    } else if (!this.isEnrolled) {
      this.snackBar.open('Please enroll in the course to access content', 'Close', { duration: 3000 });
    } else {
      this.snackBar.open('No content URL available', 'Close', { duration: 3000 });
    }
  }

  getTotalLessons(): number {
    return this.courseContent.reduce((total, topic) => total + (topic.subtopics?.length || 0), 0);
  }

  getTopicLessonsCount(topic: CourseContent): number {
    return topic.subtopics?.length || 0;
  }

  getContentType(url: string): string {
    if (!url) return 'Content';
    
    // Simple URL analysis to determine content type
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
      return 'Video';
    } else if (lowerUrl.includes('.pdf')) {
      return 'PDF';
    } else if (lowerUrl.includes('.doc') || lowerUrl.includes('.docx')) {
      return 'Document';
    } else if (lowerUrl.includes('.ppt') || lowerUrl.includes('.pptx')) {
      return 'Presentation';
    } else {
      return 'Link';
    }
  }
}