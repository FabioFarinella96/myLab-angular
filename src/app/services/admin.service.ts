import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { Sample } from '../models/sample';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(public auth: AuthService, private http: HttpClient) {}

  newSample: Sample;
  isNewSample: boolean = false;

  samples: any = [];

  addSample(adminForm: NgForm) {
    const name = adminForm.value.name;
    const description = adminForm.value.description;

    const tokenString = localStorage.getItem('userToken');
    this.auth.token = JSON.parse(tokenString!);

    const body = {
      name: name,
      description: description,
    };

    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.token}`
    );

    this.http
      .post<any>(
        'https://frontendtest-backend.azurewebsites.net/api/Samples',
        body,
        {
          headers: headers,
        }
      )
      .subscribe((res: any) => {
        this.newSample = res;
        this.isNewSample = true;
        this.samples.push(this.newSample);
      });
  }

  removeSample(sampleToRemove: string) {
    // Header
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.token}`
    );

    this.http
      .delete(
        `https://frontendtest-backend.azurewebsites.net/api/Samples/${sampleToRemove}`,
        { headers: headers }
      )
      .subscribe((res: any) => {
        this.samples = this.samples.filter(
          (sample: any) => sample.id !== sampleToRemove
        );
      });
  }
}
