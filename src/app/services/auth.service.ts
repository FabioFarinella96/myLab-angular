import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {
    this.accessToken = this.getStoredToken();
    this.email = this.getStoredEmail();
  }

  getStoredToken(): any {
    const storedToken = localStorage.getItem('userToken');
    return storedToken ? JSON.parse(storedToken) : null;
  }

  getStoredEmail(): string {
    const storedEmail = localStorage.getItem('email');
    return storedEmail ? JSON.parse(storedEmail) : '';
  }

  loginUrl: string =
    'https://frontendtest-backend.azurewebsites.net/api/Users/Login';
  accessToken: any;
  token: any;
  isLoginError: boolean = false;

  searchText: any = '';
  isSearchText: boolean = false;

  tests: any;
  isTests: boolean = false;

  // user type
  email: string;
  userType() {
    const atIndex = this.email.indexOf('@');
    return this.email.substring(0, atIndex);
  }

  login(loginForm: NgForm) {
    this.email = loginForm.value.email;
    let password = loginForm.value.password;

    this.http
      .post(this.loginUrl, {
        email: this.email,
        password: password,
      })
      .subscribe(
        (res) => {
          this.accessToken = res;

          this.router.navigateByUrl('search');
          localStorage.setItem(
            'userToken',
            JSON.stringify(this.accessToken.accessToken)
          );
          localStorage.setItem('email', JSON.stringify(this.email));
        },
        (err: HttpErrorResponse) => {
          this.isLoginError = true;
        }
      );
  }

  logout() {
    this.isLoginError = false;
    this.accessToken = null;
    localStorage.removeItem('userToken');
    localStorage.removeItem('email');
    this.router.navigateByUrl('login');
  }

  isLogged() {
    const isAuth = this.accessToken && this.accessToken ? true : false;
    return isAuth;
  }

  // searchSample
  searchSample(text: string) {
    const tokenString = localStorage.getItem('userToken');
    this.token = JSON.parse(tokenString!);

    // Header
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.token}`
    );

    this.http
      .get(
        `https://frontendtest-backend.azurewebsites.net/api/Samples/${text}`,
        { headers }
      )
      .subscribe((res) => {
        this.searchText = res;
        this.isSearchText = true;
      });
  }

  // tests viewer - chiamata get ai tests, ma non corrispondono ai samples poichè hanno id diverso
  viewTests() {
    const tokenString = localStorage.getItem('userToken');
    this.token = JSON.parse(tokenString!);

    // Header
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.token}`
    );

    this.http
      .get('https://frontendtest-backend.azurewebsites.net/api/Tests', {
        headers,
      })
      .subscribe((res: any) => (this.tests = res.items[0]));
    this.isTests = true;
  }
}
