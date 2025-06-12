export interface Course {
    id?: number;
    title: string;
    body: string;
    imageUrl?: string; // Optional, as per form
    price: number;
}