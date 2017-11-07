import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthService {
  private apiUrl = '/api/isAuth';
  name: string;
  
  constructor(private http: HttpClient) { }
  
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
  
  isAuthenticated(): Promise<any> {
    return this.http
               .get(this.apiUrl)
               .toPromise()
               .then(response => response)
               .catch(this.handleError);
  }
  getName(): Promise<any> {
    return this.http
               .get('/api/user')
               .toPromise()
               .then(response => response)
               .catch(this.handleError);
  }
}
