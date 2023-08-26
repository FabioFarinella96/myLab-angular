import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-search',
  templateUrl: `./search.component.html`,
  styleUrls: [`./search.component.css`],
})
export class SearchComponent implements OnInit {
  constructor(
    private http: HttpClient,
    public auth: AuthService,
    public admin: AdminService,
    public router: Router
  ) {}

  ngOnInit() {
    if (this.auth.accessToken) {
      const tokenString = localStorage.getItem('userToken');
      this.auth.token = JSON.parse(tokenString!);

      // Header
      const headers = new HttpHeaders().set(
        'Authorization',
        `Bearer ${this.auth.token}`
      );

      this.http
        .get('https://frontendtest-backend.azurewebsites.net/api/Samples', {
          headers,
        })
        .subscribe((res: any) => {
          this.admin.samples = res.items;
          console.log(this.admin.samples);
        });
    } else this.router.navigateByUrl('login');
  }
}
