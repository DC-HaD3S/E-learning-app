export interface Subtopic {
  id?: number;
  name: string;
  url: string;
}

export interface CourseContent {
  id?: number;
  topic: string;
  subtopics: Subtopic[];
}

export interface TopicUpdate {
  topic: string;
}

export interface SubtopicUpdate {
  name: string;
  url: string;
}