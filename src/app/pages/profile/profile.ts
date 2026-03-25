import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatCardModule, MatButtonModule, MatInputModule, MatFormFieldModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss'],
})
export class Profile implements OnInit {
  profile: any = null;
  userRole: string = '';
  isDark = localStorage.getItem('darkMode') === 'true';

  editData = { name: '', email: '' };
  passwordData = { oldPassword: '', newPassword: '' };

  loadingProfile = false;
  loadingUpdate = false;
  loadingPassword = false;

  errorMessage = '';
  successMessage = '';

  constructor(private userService: UserService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.applyTheme();
    this.getProfile();
  }

  getProfile() {
    this.loadingProfile = true;
    this.clearMessages();

    this.userService.getProfile().subscribe({
      next: (res) => {
        this.profile = res;
        if (res) {
          this.editData.name = res.name;
          this.editData.email = res.email;
          this.userRole = res.role || '';
        }
        this.loadingProfile = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingProfile = false;
        this.errorMessage = 'Failed to load profile';
        this.cdr.detectChanges();
      }
    });
  }

  updateProfile() {
    this.loadingUpdate = true;
    this.clearMessages();

    this.userService.updateProfile(this.editData).subscribe({
      next: (res) => {
        this.profile = res;
        this.loadingUpdate = false;
        this.successMessage = 'Profile updated successfully';
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingUpdate = false;
        this.errorMessage = 'Failed to update profile';
        this.cdr.detectChanges();
      }
    });
  }

  changePassword() {
    this.loadingPassword = true;
    this.clearMessages();

    this.userService.changePassword(this.passwordData).subscribe({
      next: () => {
        this.loadingPassword = false;
        this.successMessage = 'Password changed successfully';
        this.passwordData = { oldPassword: '', newPassword: '' };
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingPassword = false;
        this.errorMessage = 'Failed to change password';
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

  toggleTheme() {
    this.isDark = !this.isDark;
    localStorage.setItem('darkMode', String(this.isDark));
    this.applyTheme();
  }

  applyTheme() {
    if (this.isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
}
