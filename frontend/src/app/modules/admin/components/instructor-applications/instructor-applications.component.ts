import { Component, OnInit } from '@angular/core';
import { InstructorApplication } from 'src/app/shared/models/instructor-application.model';
import { InstructorService } from 'src/app/shared/services/instructor.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-instructor-applications',
  templateUrl: './instructor-applications.component.html',
  styleUrls: ['./instructor-applications.component.css']
})
export class InstructorApplicationsComponent implements OnInit {
  applications: InstructorApplication[] = [];
  isLoading = false;
  displayedColumns: string[] = ['name', 'email', 'experience', 'status', 'appliedAt', 'actions'];

  constructor(
    private instructorService: InstructorService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.isLoading = true;
    this.instructorService.getInstructorApplications().subscribe({
      next: (applications) => {
        this.applications = applications;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading applications:', error);
        this.isLoading = false;
      }
    });
  }

  approveApplication(application: InstructorApplication): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Approve Application',
        message: `Are you sure you want to approve ${application.name}'s instructor application?`,
        confirmText: 'Approve',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && application.id) {
        this.instructorService.approveApplication(application.id).subscribe({
          next: () => {
            this.loadApplications();
          },
          error: (error: any) => {
            console.error('Error approving application:', error);
          }
        });
      }
    });
  }

  rejectApplication(application: InstructorApplication): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Reject Application',
        message: `Are you sure you want to reject ${application.name}'s instructor application?`,
        confirmText: 'Reject',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && application.id) {
        // For now, we only support approval. Rejection can be added later if needed.
        console.log('Rejection functionality not implemented yet');
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'approved': return 'primary';
      case 'rejected': return 'warn';
      default: return 'accent';
    }
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }
}