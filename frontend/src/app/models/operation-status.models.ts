export interface OperationStatus {
  operation: 'load' | 'loadAdmin' | 'add' | 'update' | 'delete' | 'enroll' | 'loadEnrollments';
  success: boolean;
  message?: string;
  timestamp: number;
}