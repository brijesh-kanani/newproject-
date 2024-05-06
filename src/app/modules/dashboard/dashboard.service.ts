import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DashboardService {
  public countDown = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) { }

  getCardData(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(environment.phUrl + `/api/log/dashboard/cardcount`)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  getChartData(fromDate: any, toDate: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(environment.phUrl + `/api/log/dashboard/count?importedFrom=${fromDate}&importedTo=${toDate}`)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  getTimeByUser(userId: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(environment.phUrl + `/api/configurations?userId=${userId}`)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  setTimeByUser(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(environment.phUrl + `/api/configurations`, body)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  getDashboardMeterCount(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(environment.phUrl + `/api/log/dashboard/metercount`)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  getAreaChartData(fromDate: any, toDate: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(environment.phUrl + `/api/log/dashboard/areachartdata?fromDate=${fromDate}&toDate=${toDate}`)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  getNotificationsData(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(environment.phUrl + `/api/log/dashboard/notifications`)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
}
