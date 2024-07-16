// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';
import { environment } from './environment/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authToken: string | null = null;
  private refreshInProgress = false;
  private refreshSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAuthToken(): string | null {
    //console.log(localStorage.getItem('authToken'));
    console.log(this.authToken);
    return localStorage.getItem('authToken');
    //return this.authToken;
  }

  setAuthData(authData: any): void {
    this.authToken = authData.authenticationToken;
    localStorage.setItem('authToken', authData.authenticationToken);
    localStorage.setItem('authData', JSON.stringify(authData));
    console.log(localStorage.getItem('authToken'));
  }

  refreshToken(): Observable<string|null> {
    if (this.refreshInProgress) {
      return this.refreshSubject.asObservable();
    } else {
      this.refreshInProgress = true;
      return this.http.post<{ token: string }>(`${this.apiUrl}/refresh`, {
        email: 'adminUser@intelegencia.com',
        Password: 'sneWDHvd8s6eisZ'
      }).pipe(
        tap(response => {
          this.authToken = response.token;
          this.refreshInProgress = false;
          this.refreshSubject.next(response.token);
        }),
        switchMap(response => of(response.token)),
        catchError(error => {
          this.refreshInProgress = false;
          this.refreshSubject.next(null);
          return of(null);
        })
      );
    }
  }
}
