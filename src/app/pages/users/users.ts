import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatCardModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatTableModule, MatSelectModule],
  templateUrl: './users.html',
  styleUrls: ['./users.scss'],
})
export class Users implements OnInit {
  users: any[] = [];
  userRole: string = '';

  newUser = { name: '', email: '', password: '', role: 'user' };

  searchText = '';
  currentPage = 1;
  totalPages = 1;

  loadingUsers = false;
  loadingCreate = false;

  errorMessage = '';
  successMessage = '';

  constructor(private userService: UserService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadRole();
    this.getUsers();
  }

  loadRole() {
    this.userService.getProfile().subscribe({
      next: (res) => {
        this.userRole = res?.role || '';
      }
    });
  }

  getUsers() {
    this.loadingUsers = true;
    this.clearMessages();

    this.userService.getUsers(this.currentPage, this.searchText).subscribe({
      next: (res: any) => {
        this.users = res.users || [];
        this.totalPages = res.totalPages;
        this.loadingUsers = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingUsers = false;
        this.errorMessage = 'Failed to load users';
        this.cdr.detectChanges();
      }
    });
  }

  onSearch() {
    this.currentPage = 1;
    this.getUsers();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getUsers();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getUsers();
    }
  }

  deleteUser(id: string) {
    if (!confirm('Are you sure you want to delete this user?')) return;

    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.successMessage = 'User deleted successfully';
        this.cdr.detectChanges();
        this.getUsers();
      },
      error: () => {
        this.errorMessage = 'Failed to delete user';
        this.cdr.detectChanges();
      }
    });
  }

  createUser() {
    this.loadingCreate = true;
    this.clearMessages();

    this.userService.createUser(this.newUser).subscribe({
      next: () => {
        this.successMessage = 'User created successfully';
        this.loadingCreate = false;
        this.newUser = { name: '', email: '', password: '', role: 'user' };
        this.cdr.detectChanges();
        this.getUsers();
      },
      error: () => {
        this.loadingCreate = false;
        this.errorMessage = 'Failed to create user';
        this.cdr.detectChanges();
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }

  clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
