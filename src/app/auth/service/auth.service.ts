import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { HttpClient } from '@angular/common/http';
import { enviroments } from '../../../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = enviroments.baseUrl; // http://localhost:3000
  private user?: User;

  constructor(private http: HttpClient, private router: Router) {}

  getcurrentUser(): User | undefined {
    if (!this.user) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        this.user = JSON.parse(storedUser);
      }
    }
    return structuredClone(this.user);
  }

  register(name: string, lastName: string, email: string): Observable<User> {
    const newUser = {
      id: Date.now(), // ID temporal
      user: `${name} ${lastName}`,
      email
    };

    return this.http.post<User>(`${this.baseUrl}/users`, newUser).pipe(
      tap(user => {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(user));
      }),
      tap(() => localStorage.setItem('token', 'pipipi.pipipi.pipipi')),
      tap(() => this.router.navigate(['/heroes/list'])), // Redirige a /heroes/list
      catchError(err => {
        console.error('Error al registrar:', err);
        throw err;
      })
    );
  }

  login(email: string, password: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/1`).pipe(
      tap(user => {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(user));
      }),
      tap(() => localStorage.setItem('token', 'pipipi.pipipi.pipipi'))
    );
  }

  checkAuthentication(): Observable<boolean> {
    if (!localStorage.getItem('token')) return of(false);
    return this.http.get<User>(`${this.baseUrl}/users/1`).pipe(
      tap(user => {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(user));
      }),
      map(user => !!user),
      catchError(() => of(false))
    );
  }

  logout() {
    this.user = undefined;
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }
}