import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {

  users: any[] = [];
  profile: any = null;

  editData = {
    name: '',
    email: ''
  };

  passwordData = {
    oldPassword: '',
    newPassword: ''
  };

  loadingUsers = false;
  loadingProfile = false;
  loadingUpdate = false;
  loadingPassword = false;

  errorMessage = '';
  successMessage = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getProfile();
    this.getUsers();
  }

  // ================= GET PROFILE =================
  getProfile() {
    this.loadingProfile = true;
    this.clearMessages();

    this.userService.getProfile().subscribe({
      next: (res) => {
        this.profile = res;
        this.editData.name = res.name;
        this.editData.email = res.email;
        this.loadingProfile = false;
      },
      error: () => {
        this.loadingProfile = false;
        this.errorMessage = 'Failed to load profile';
      }
    });
  }

  // ================= GET USERS =================
  getUsers() {
    this.loadingUsers = true;
    this.clearMessages();

    this.userService.getUsers().subscribe({
      next: (res) => {
        this.users = res;
        this.loadingUsers = false;
      },
      error: () => {
        this.loadingUsers = false;
        this.errorMessage = 'Failed to load users';
      }
    });
  }

  // ================= UPDATE PROFILE =================
  updateProfile() {
    this.loadingUpdate = true;
    this.clearMessages();

    this.userService.updateProfile(this.editData).subscribe({
      next: (res) => {
        this.profile = res;
        this.loadingUpdate = false;
        this.successMessage = 'Profile updated successfully';
      },
      error: () => {
        this.loadingUpdate = false;
        this.errorMessage = 'Failed to update profile';
      }
    });
  }

  // ================= CHANGE PASSWORD =================
  changePassword() {
    this.loadingPassword = true;
    this.clearMessages();

    this.userService.changePassword(this.passwordData).subscribe({
      next: () => {
        this.loadingPassword = false;
        this.successMessage = 'Password changed successfully';

        this.passwordData = {
          oldPassword: '',
          newPassword: ''
        };
      },
      error: () => {
        this.loadingPassword = false;
        this.errorMessage = 'Failed to change password';
      }
    });
  }

  // ================= LOGOUT =================
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  // ================= HELPER =================
  clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }
}