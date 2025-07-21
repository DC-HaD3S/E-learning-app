export interface Course {
  id?: number;
  title: string;
  body: string;
  imageUrl: string;
  price: number;
  instructor: string | { id: number; name?: string; email?: string } | any;
  bestSelling?: boolean;
  totalLearners?: number;
  averageRating?: number;
  totalReviews?: number;
}