import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CustomerAccountService {
    roles = [];

    users = [];
    editCrateUser: any;
    mappingData?: any;
    viewFileLogData: any;
    ftpMappingData: any;
    receivingFTPlist: any;
    public ftpAccountListData = new BehaviorSubject<any>(null);
    reportList = new BehaviorSubject<boolean>(true);

    constructor(private http: HttpClient) {}

    getUsers(filter: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http
                .get(
                    environment.url +
                        `/login/User/GetUsers?FirstName=${filter.FirstName}&page=${filter.page}&pageSize=${filter.pageSize}&roles=${filter.roles}&Email=${filter.Email}&PageSortBy=${filter.PageSortBy}&pageSortDir=${filter.pageSortDir}`
                )
                .subscribe((response: any) => {
                    this.users = response.data;
                    resolve(response);
                }, reject);
        });
    }

    create(user: any): Promise<any> {
        return this.http
            .post(environment.url + '/login/User/createOrEditUser', user)
            .toPromise(); // Replace with your API endpoint
    }

    deleteMapping(data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http
                .delete(environment.hUrl + `/api/mapping?id=${data}`)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    deleteFtpMapping(data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http
                .delete(
                    environment.receivingUrl +
                        `/api/Mapping/RemoveMapping?mappingId=${data}`
                )
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    deleteFTP(data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http
                .delete(
                    environment.phUrl +
                        `/api/accounts/deleteAccountWithFolder/${data.AccountId}/${data.FolderConfigId}`
                )
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    getRoles(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http
                .get(environment.url + '/login/User/GetRoles')
                .subscribe((response: any) => {
                    this.roles = response.data;
                    resolve(this.roles);
                }, reject);
        });
    }

    resetPassword(user: any): Promise<any> {
        return this.http
            .post(environment.url + '/login/User/resetPassword', user)
            .toPromise(); // Replace with your API endpoint
    }

    public getCountryList(): Observable<any> {
        const request = `${environment.url}/login/User/getCountries`;
        return this.http.get(request);
    }

    public getStateList(idCountry: number): Observable<any> {
        const request = `${environment.url}/login/User/getStateTerritoriesByCountry?countryID=${idCountry}`;
        return this.http.get(request);
    }

    getMapping(data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http
                .get(
                    environment.hUrl +
                        `/api/mapping?accountNumber=${data.accountNumber}&warehouseId=${data.warehouseId}`
                )
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    getAccountList(data: any): Promise<any> {
        let user = JSON.parse(localStorage.getItem('user'));
        return new Promise((resolve, reject) => {
            if (user.IdRole == 1) {
                this.http
                    .get(
                        environment.phUrl +
                            `/api/useraccounts?accountName=${data.name}&status=${data.status}`
                    )
                    .subscribe((response: any) => {
                        resolve(response);
                    }, reject);
            } else {
                this.http
                    .get(
                        environment.phUrl +
                            `/api/useraccounts?accountName=${data.name}&status=${data.status}&accountNumber=${user.AccountNumber}`
                    )
                    .subscribe((response: any) => {
                        resolve(response);
                    }, reject);
            }
        });
    }

    getFTPDetails(data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http
                .get(
                    environment.phUrl +
                        `/api/accounts/listAccountsByFolderConfig?accountNumber=${data}`
                )
                .subscribe((response: any) => {
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
                redirect: 'follow',
            };

            fetch(
                environment.hUrl + '/api/mapping/readXmlFile1',
                requestOptions
            ).then((response) => {
                if (response) {
                    return resolve(response.json());
                }
                return reject(response);
            }, reject);
        });
    }

    editFtp(data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http
                .put(
                    environment.phUrl + `/api/accounts/editAccountWithFolder`,
                    data
                )
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    createFtp(data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http
                .post(
                    environment.phUrl + `/api/accounts/createAccountWithFolder`,
                    data
                )
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    activeInactiveFTP(data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http
                .put(environment.phUrl + `/api/accounts`, data)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    getWarehouseByUser(data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http
                .get(environment.phUrl + `/api/warehouse?idUser=${data.IdUser}`)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    getWarehouseByAccountNumber(data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http
                .get(
                    environment.phUrl +
                        `/api/warehouse?accountNumber=${data.user.AccountNumber}`
                )
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    getReceiverFtpByAccountNumber(data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http
                .get(
                    `${environment.receivingUrl}/api/Mapping/ftpAccounts?AccountNumber=${data.user.AccountNumber}`
                )
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    getMappingByFtp(data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http
                .get(
                    `${environment.receivingUrl}/api/Mapping/GetAccountMappingDetails?AccountNumber=${data.accountNumber}&FTPAccountId=${data.ftpAccountId}&MappingType=${data.mapType}`
                )
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    getReceiverMappingType(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http
                .get(`${environment.receivingUrl}/api/Mapping/MappingType`)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    getJobsByAccount(data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http
                .get(
                    `${environment.reportingUrl}/api/Job/GetJobsByAccount?accountId=${data}`
                )
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    getEmailsByAccount(data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http
                .get(
                    `${environment.reportingUrl}/api/Account/GetEmail?accountId=${data}`
                )
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    createEditEmailForAccount(data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http
                .post(
                    `${environment.reportingUrl}/api/Account/CreateUpdateEmail`,
                    data
                )
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    deleteEmailForAccount(data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http
                .delete(
                    `${environment.reportingUrl}/api/Account/DeleteEmail?id=${data}`
                )
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }
}
