export interface Course {
  id?: number;
  title: string;
  body: string;
  imageUrl: string;
  price: number;
  instructor: string;
instructorId: number | null; 
}