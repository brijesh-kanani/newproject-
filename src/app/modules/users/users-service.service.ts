import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersServiceService {
  roles = [];

  users = [];
  editCrateUser:any;

  constructor(private http: HttpClient) { }

  getUsers(filter: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(environment.url + `/login/User/GetUsers?FirstName=${filter.FirstName}&page=${filter.page}&pageSize=${filter.pageSize}&roles=${filter.roles}&Email=${filter.Email}&PageSortBy=${filter.PageSortBy}&pageSortDir=${filter.pageSortDir}`)
        .subscribe((response: any) => {

          this.users = response.data;
          resolve(response);
        }, reject);
    });
  }

  create(user: any): Promise<any> {
    return this.http.post(environment.url + '/login/User/createOrEditUser', user).toPromise(); // Replace with your API endpoint
  }

  deleteuser(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.delete(environment.url + `/login/User/deleteUser?userId=${data.id}`)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  getRoles(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(environment.url + '/login/User/GetRoles')
        .subscribe((response: any) => {

          this.roles = response.data;
          resolve(this.roles);
        }, reject);
    });
  }

  resetPassword(user: any): Promise<any> {
    return this.http.post(environment.url + '/login/User/resetPassword', user).toPromise(); // Replace with your API endpoint
  }

  public getCountryList(): Observable<any> {
    const request = `${environment.url}/login/User/getCountries`;
    return this.http.get(request);
  }

  public getStateList(idCountry: number): Observable<any> {
    const request = `${environment.url}/login/User/getStateTerritoriesByCountry?countryID=${idCountry}`;
    return this.http.get(request);
  }
}
