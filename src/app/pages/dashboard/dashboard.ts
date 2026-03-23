import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
  users: any[] = [];
  profile: any = null;

  loadingUsers = false;
  loadingProfile = false;
  errorMessage = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getProfile();
    this.getUsers();
  }

  getProfile() {
    this.loadingProfile = true;
    this.errorMessage = '';

    this.userService.getProfile().subscribe({
      next: (response) => {
        console.log('Profile:', response);
        this.profile = response;
        this.loadingProfile = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log(error);
        this.loadingProfile = false;
        this.errorMessage = 'Failed to load profile';
      }
    });
  }

  getUsers() {
    this.loadingUsers = true;
    this.errorMessage = '';

    this.userService.getUsers().subscribe({
      next: (response) => {
        console.log('Users:', response);
        this.users = response;
        this.loadingUsers = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log(error);
        this.loadingUsers = false;
        this.errorMessage = 'Failed to load users';
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}