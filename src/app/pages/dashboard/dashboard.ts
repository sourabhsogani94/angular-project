import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatInputModule, MatTableModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {

  users: any[] = [];
  profile: any = null;
  userRole: string = '';

  editData = {
    name: '',
    email: ''
  };

  passwordData = {
    oldPassword: '',
    newPassword: ''
  };
  newUser = {
  name: '',
  email: '',
  password: '',
  role: 'user'
};

loadingCreate = false;

  loadingUsers = false;
  loadingProfile = false;
  loadingUpdate = false;
  loadingPassword = false;
currentPage = 1;
totalPages = 1;
searchText = '';
  errorMessage = '';
  successMessage = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef

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
      console.log('PROFILE RESPONSE:', res); // 👈 ADD THIS

      this.profile = res;

      if (res) {
        this.editData.name = res.name;
        this.editData.email = res.email;
        this.userRole = res.role || '';
      }

      this.loadingProfile = false;
      this.cdr.detectChanges(); // 👈 ADD THIS
    },
    error: (err) => {
      console.log('PROFILE ERROR:', err); // 👈 ADD THIS
      this.loadingProfile = false;
      this.errorMessage = 'Failed to load profile';
    }
  });
}

  // ================= GET USERS =================
getUsers() {
  this.loadingUsers = true;

  this.userService.getUsers(this.currentPage, this.searchText).subscribe({
    next: (res: any) => {
      console.log('USERS RESPONSE:', res);

      this.users = res.users || [];
      this.totalPages = res.totalPages;

      this.loadingUsers = false;
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.log(err);
      this.loadingUsers = false;
      this.errorMessage = 'Failed to load users';
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
  deleteUser(id: string) {
  if (!confirm('Are you sure you want to delete this user?')) {
    return;
  }

  this.userService.deleteUser(id).subscribe({
    next: () => {
      this.successMessage = 'User deleted successfully';

      // 🔥 Refresh list
      this.getUsers();
    },
    error: (err) => {
      console.log(err);
      this.errorMessage = 'Failed to delete user';
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

      // reset form
      this.newUser = {
        name: '',
        email: '',
        password: '',
        role: 'user'
      };

      // refresh list
      this.getUsers();
    },
    error: (err) => {
      console.log(err);
      this.loadingCreate = false;
      this.errorMessage = 'Failed to create user';
    }
  });
}
}