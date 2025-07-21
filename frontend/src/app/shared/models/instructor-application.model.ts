import { Course } from './course.model';

export interface InstructorApplication {
  id?: number;
  name: string;
  email: string;
  bio: string;
  experience: string;
  qualifications: string;
  twitterHandle?: string;
  githubHandle?: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt?: Date;
  reviewedAt?: Date;
  profileImageUrl?: string;
}

export interface Instructor {
  id?: number;
  name: string;
  email: string;
  bio: string;
  profileImageUrl?: string;
  twitterHandle?: string;
  githubHandle?: string;
  totalLearners: number;
  totalReviews: number;
  averageRating: number;
  courses?: Course[];
}