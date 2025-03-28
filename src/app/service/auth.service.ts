import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private authState = new BehaviorSubject<boolean>(false);
  private userSubject = new BehaviorSubject<any>(null);

  private loadingSubject = new BehaviorSubject<boolean>(false);
  private successSubject = new BehaviorSubject<boolean | null>(null);

  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) {
    this.authState.next(this.hasValidToken());
    this.loadUserData();
  }

  registerUser(userData: any): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/register`, userData, { withCredentials: true })
      .pipe(
        tap((response) => {
          if (response && response.token) {
            this.saveUserData(response);
          }
        })
      );
  }

  loginUser(username: string, password: string) {
    return this.http.post(`${this.apiUrl}/login`, { username, password }, { withCredentials: true }).subscribe({
      next: (response: any) => {
        if (response && response.token) {
          this.saveUserData(response);
        }
      },
      error: (err) => {
        console.error('Error en login:', err);
      }
    });
  }

  get loading$() {
    return this.loadingSubject.asObservable();
  }

  get success$() {
    return this.successSubject.asObservable();
  }

  private saveUserData(response: any) {
    const encodedData = btoa(JSON.stringify(response));
    this.cookieService.set('userData', encodedData, { path: '/', expires: 7, secure: true, sameSite: 'Strict' });
    this.authState.next(true);
    this.loadUserData();
    this.router.navigate(['/home']);
  }

  isAuthenticated(): Observable<boolean> {
    return this.authState.asObservable();
  }

  hasValidToken():boolean{
    if(!this.cookieService){
      return false;
    }
    return this.cookieService.check("userData");

  }

  getUserData(): any {
    const cookieData = this.cookieService.get('userData');
    return cookieData ? JSON.parse(atob(cookieData)) : null;
  }

  getUser():Observable<any>{
    return this.userSubject.asObservable();
  }

  private loadUserData(){
    const user = this.getUserData();
    this.userSubject.next(user);
  }

  getToken(): string | null {
    const userData = this.getUserData();
    return userData ? userData.token : null;
  }

  getIdUser():string | null {
    const userData = this.getUserData();
    return userData ? userData.id : null;
  }

  logout() {
    this.cookieService.delete("userData");
    this.authState.next(false);
    this.userSubject.next(null);
    this.router.navigate(['/']);
  }

}
