import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: any = null;

  constructor() {}

  login(user: any) {
    this.currentUser = user;
    console.log(this.currentUser)
  }

  logout() {
    this.currentUser = null;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  getCurrentUser() {
    return this.currentUser;
  }
}