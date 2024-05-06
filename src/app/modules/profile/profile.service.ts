import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
    onProfileChanged: BehaviorSubject<any>;

  constructor(private http: HttpClient) {
    this.onProfileChanged = new BehaviorSubject({});
  }


  public getUserProfile(userId:string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(environment.url + `/login/User/getUserProfile?userId=${userId}`)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  public changePassword(user: any): Promise<any> {
    return this.http.post(environment.url + '/login/Authentication/changePassword', user).toPromise(); // Replace with your API endpoint
  }

  public updateProfile(user: any): Promise<any> {
    return this.http.post(environment.url + '/login/Authentication/updateProfile', user).toPromise(); // Replace with your API endpoint
  }
}
