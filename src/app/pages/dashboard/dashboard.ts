import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
  profile: any = null;
  userRole: string = localStorage.getItem('role') || '';
  loadingProfile = false;
  isDark = localStorage.getItem('darkMode') === 'true';

  constructor(private userService: UserService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.applyTheme();
    this.getProfile();
  }

  getProfile() {
    this.loadingProfile = true;
    this.userService.getProfile().subscribe({
      next: (res) => {
        this.profile = res;
        this.userRole = res?.role || '';
        this.loadingProfile = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingProfile = false;
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }

  makeAdmin() {
    this.userService.makeAdmin().subscribe({
      next: () => {
        localStorage.setItem('role', 'admin');
        this.userRole = 'admin';
        this.cdr.detectChanges();
        this.getProfile();
      },
      error: () => {
        alert('Failed to make admin');
      }
    });
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