import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class FileLogService {
    viewLogData: any;
    filters: any = [];
    constructor(private _httpClient: HttpClient) { }

    getAllFileLogList(filter: any): Promise<any> {
        let account = {
            AccountNumber: filter.accountNumber
        }
        return new Promise((resolve, reject) => {
            this._httpClient
                .post(environment.phUrl + `/api/log/filelogList?importedFrom=${filter.FromDate}&importedTo=${filter.ToDate}&limit=${filter.pageSize}&pageNumber=${filter.page}&status=${filter.status}&fileType=${filter.fileType}`, account)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    getFileLogData(fileId: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get(environment.phUrl + `/api/log/fileStatusWithOrderLogs/${fileId}`)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    reUploadFile(fileId: any): Promise<any> {
        let body = {
            "fileHeaderId": fileId.id
        }
        return new Promise((resolve, reject) => {
            this._httpClient
                .post(environment.phUrl + `/api/ftp/filereupload`, body)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    reUploadFileForReceipt(fileId: any): Promise<any> {
        console.log(fileId, 'fileId')
        let body = {
            "fileHeaderId": fileId.id,
            "folderConfigId": fileId.folder_config_id
        }
        return new Promise((resolve, reject) => {
            this._httpClient
                .post(environment.reUploadUrl + `/api/FileProcessing/Re-UploadFileAndPublish?fileHeaderId=${fileId.id}&folderConfigId=${fileId.folder_config_id}`, body)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    getFileLogList(filter: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get(environment.phUrl + `/api/log/fileHeader/${filter.warehouseId}?limit=${filter.limit}&pageNumber=${filter.pageNumber}&AccountNumber=${filter.accountNumber}&importedFrom=${filter.importedFrom}&importedTo=${filter.importedTo}`)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    getFileLog(fileId: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get(environment.phUrl + `/api/log/fileStatusWithOrderLogs/${fileId}`)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    // downloadFile(file: any): Promise<any> {
    //     if (file && file.id) {
    //         let body: any = {
    //             "fileHeaderId": file.id,
    //             "folderConfigId": file.folder_config_id
    //         }
    //         return new Promise((resolve, reject) => {
    //             this._httpClient
    //                 .post(environment.phUrl + `/api/ftp/fileDownload`, body)
    //                 .subscribe((response: any) => {
    //                     resolve(response);
    //                 }, reject);
    //         });
    //     } else {
    //         let msg: any = "File id not found"
    //         return msg
    //     }
    // }

    downloadFile(file: any): Observable<HttpResponse<Blob>> {
        if (file && file.id) {
            let body: any = {
                "fileHeaderId": file.id,
                "folderConfigId": file.folder_config_id
            }
            const url = environment.phUrl + `/api/ftp/fileDownload`;

            // Set the response type to 'blob' to handle binary data
            return this._httpClient.post(url, body, { responseType: 'blob', observe: 'response' });
        }
    }
}
