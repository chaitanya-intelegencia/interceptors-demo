// src/app/app.component.ts

import { Component, OnInit } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from './environment/environment';
import { HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class AppComponent implements OnInit {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {

  }

  getData(): void {
    const url = `${this.apiUrl}/login`;
    const body = {
      email: 'adminUser@intelegencia.com',
      Password: 'sneWDHvd8s6eisZ'
    };

    this.http.post(url, body).subscribe({
      next: data => {
        console.log(data);
        this.authService.setAuthData(data); // Store token and other data
      },
      error: error => {
        console.error('Error getting post:', error);
      }
    });
  }
  refreshData():void{
    this.authService.refreshToken().subscribe({
      next: data => {
        console.log(data);  
      },
      error: error => {
        console.error('Error getting post:', error);
      }
    });
  }

  tokenCheckData(): void {
    const url = `${this.apiUrl}/getRoles`;
  
    this.http.get(url).subscribe({
      next: data => {
        console.log(data);
      },
      error: error => {
        console.error('Error getting roles:', error);
        // Check if the error is related to token expiration
        if (error.status === 401) {
          this.refreshData(); // Call a method to refresh the token
        }
      }
    });
  }
}
