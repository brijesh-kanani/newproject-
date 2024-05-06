import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReceivingService {
  public nextStepEvent: EventEmitter<void> = new EventEmitter<void>();
  currentOrderDetailsAdded?: any = [];
  reference = '';
  notes?: string;
  updateTempList = new BehaviorSubject([]);
  callProgressbarApi = new BehaviorSubject([]);
  callProgressApi = new BehaviorSubject([]);
  response = new BehaviorSubject([]);
  templete?: any;
  editMode?: boolean;
  warehouse?: any;
  exelData: any
  file: File
  selectedColumn: any;
  mapping: any;
  validateFlag: boolean = false;
  ftpAccountListData: any;
  mappingWarehouseData: any;
  mappingFtpAccountData: any;
  mappingTypes: any
  mappingTypesData: any;

  constructor(private _httpClient: HttpClient) { }


  public goToNextStep(): void {
    this.nextStepEvent.emit();
  }

  updateMappingRow(data: any): Promise<any> {
    if (data && data.ftpMappingLineId) {
      let body: any = {
        "ftpMapplingLineId": data.ftpMappingLineId,
        "field": data.field,
        "mapTo": data.mapTo
      }
      return new Promise((resolve, reject) => {
        this._httpClient.put(`${environment.receivingUrl}/api/Mapping/UpdateMappingLineField`, body)
          .subscribe((response: any) => {
            resolve(response);
          }, reject);
      });
    } else {
      console.log('Mapping id not found')
    }
  }

  updateMappingFilterRow(data: any): Promise<any> {
    let body: any = {

      "ftpFilterId": data.ftpFilterId,
      "ftpMappingLineId": data.ftpMapplingId,
      "search": data.search,
      "replace": data.replace,
      "searchType": data.searchType,
      "ignoreCase": data.ignoreCase,
      "replaceWholeField": data.replaceWholeField

    }
    return new Promise((resolve, reject) => {
      this._httpClient.put(`${environment.receivingUrl}/api/Mapping/UpdateMappingLineFilterField`, body)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  public deleteMappingFilterRow(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.delete(`${environment.receivingUrl}/api/Mapping/RemoveFilter?mappingLineId=${data.ftpMapplingId}&FTPFilterId=${data.ftpFilterId}`).subscribe(response => {
        resolve(response);
      }, reject);
    });
  }

  createMapping(formData: FormData): Promise<any> {
    // const token = JSON.parse(localStorage.getItem(environment.tokenKey) as string);
    return new Promise((resolve, reject) => {
      var myHeaders = new Headers();
      // myHeaders.append("Authorization", `Bearer ${token.access_token}`);

      var requestOptions: any = {
        method: 'POST',
        headers: myHeaders,
        body: formData,
        redirect: 'follow'
      };

      fetch(`${environment.receivingUrl}/api/Mapping/CreateMapping`, requestOptions)
        .then(response => {
          if (response) {
            return resolve(response.json());
          }
          return reject(response);
        }, reject)
    });
  }
}
