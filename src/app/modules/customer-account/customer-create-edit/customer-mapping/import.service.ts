import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable({ providedIn: 'root' })


export class ImportService {
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
    mappingWarehouseData: any

    constructor(private _httpClient: HttpClient,) {
    }

    public goToNextStep(): void {
        this.nextStepEvent.emit();
    }

    uploadExcelFile(file: File) {
        this.file = file;
    }

    getTempleteList(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get(
                    `${environment.url}/im/ImportMapping/getOrderMappingList`
                )
                .subscribe((response: any) => {
                    resolve(response.data);
                }, reject);
        });
    }

    public createOrderTemplate(body: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.post(environment.url + '/im/ImportMapping/createOrderMapping', body).subscribe(response => {
                resolve(response);
            }, reject);
        });
    }

    public DeleteTemplate(temp: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.delete(environment.url + `/im/ImportMapping/deleteImportMapping?templateId=${temp.templateId}`).subscribe(response => {
                resolve(response);
            }, reject);
        });
    }

    public deleteMappingFilterRow(data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.delete(environment.hUrl + `/api/mapping/deleteFilterRow?filter_id=${data.filter_id}&mapping_line_id=${data.mapping_line_id}`).subscribe(response => {
                resolve(response);
            }, reject);
        });
    }

    updateMappingFilterRow(data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.put(environment.hUrl + `/api/mapping/updatefilter`, data)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    updateMappingRow(data: any): Promise<any> {
        if (data && data.mappingLineId) {
            let body: any = {
                "id": data.mappingLineId,
                "field": data.field
            }
            return new Promise((resolve, reject) => {
                this._httpClient.put(environment.hUrl + `/api/mapping/updateMapping`, body)
                    .subscribe((response: any) => {
                        resolve(response);
                    }, reject);
            });
        } else {
            console.log('Mapping id not found')
        }
    }
}
