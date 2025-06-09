export interface Course {
  id: number;
  title: string;
  body: string;
  userId?: number;
  imageUrl?: string;
  enrolledUsers?: number[];
  price?: number; 
}