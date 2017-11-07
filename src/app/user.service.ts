import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class UserService {
  private apiUrl = '/api/user';
  constructor(private http: HttpClient) { }
  
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  isGoing(barId: string): Promise<any> {
    const params = new HttpParams().set('barId', barId);
    return this.http
               .get(this.apiUrl+'/isGoing', { params })
               .toPromise()
               .then(response => response)
               .catch(this.handleError);
               
  }
  save(barId: string): Promise<any> {
    return this.http
               .post(this.apiUrl, {'barId': barId})
               .toPromise()
               .then(response => response)
               .catch(this.handleError);
  }
  clear(): Promise<any> {
    return this.http
               .delete(this.apiUrl)
               .toPromise()
               .then(response => response)
               .catch(this.handleError);
  }
}
