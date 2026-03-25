import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  signup(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, data);
  }

getUsers(page: number, search: string) {
  return this.http.get(`${this.baseUrl}/users?page=${page}&limit=5&search=${search}`);
}
  getProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/profile`);
  }
  updateProfile(data: any): Observable<any> {
  return this.http.put(`${this.baseUrl}/profile`, data);
}
changePassword(data: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/change-password`, data);
}
deleteUser(id: string) {
  return this.http.delete(`${this.baseUrl}/user/${id}`);
}
// ================= CREATE USER (ADMIN ONLY) =================
createUser(data: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/user`, data);
}

makeAdmin(): Observable<any> {
  return this.http.put(`${this.baseUrl}/make-admin`, {});
}
}