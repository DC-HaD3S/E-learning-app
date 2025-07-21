export interface Course {
  id?: number;
  title: string;
  body: string;
  imageUrl: string;
  price: number;
  instructor: string;
  bestSelling?: boolean;
  totalLearners?: number;
  averageRating?: number;
  totalReviews?: number;
}