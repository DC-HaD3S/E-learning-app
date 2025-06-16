import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthService } from 'src/app/services/auth.services';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-registered-users',
  templateUrl: './registered-users.component.html',
  styleUrls: ['./registered-users.component.css']
})
export class RegisteredUsersComponent implements OnInit {
  users: User[] = [];
  sortedUsers: User[] = []; 
  error: string | null = null;
  sortField: string = 'name'; 
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.error = 'Please log in as an admin to view users.';
      this.snackBar.open(this.error, 'Close', { duration: 5000 });
      this.router.navigate(['/login']);
      return;
    }
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.sortedUsers = [...users]; 
        this.sortUsers(); 
        this.error = null;
      },
      error: (err) => {
        this.error = err.message;
        if (err.message.includes('Unauthorized')) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      }
    });
  }

  sortUsers(): void {
    this.sortedUsers = [...this.users]; 
    this.sortedUsers.sort((a, b) => {
      let valueA: string | undefined;
      let valueB: string | undefined;

      switch (this.sortField) {
        case 'name':
          valueA = a.name || a.username || ''; 
          valueB = b.name || b.username || '';
          break;
        case 'username':
          valueA = a.username || '';
          valueB = b.username || '';
          break;
        case 'email':
          valueA = a.email || '';
          valueB = b.email || '';
          break;
        default:
          return 0;
      }

      const isAsc = this.sortOrder === 'asc';
      return valueA.localeCompare(valueB) * (isAsc ? 1 : -1);
    });
  }

  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortUsers();
  }
}