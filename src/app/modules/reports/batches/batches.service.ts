import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BatchesService {
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);
    storeData: any
    jobDetailsData: any
    accountList:any
    batchListData:any

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }

    // -----------------------------------------------------------------------------------------------------

    getBatchData(): Promise<any> {
        let data = [
            {
                "Name": "WH3 Daily FTP",
                "BatchId":1,
                "date":'2024-02-08',
                "time": "2am",
                "BatchTimeType": 1,
                "BatchTimeName": "day",
                "BatchTimeValue": "",
                "TotalJob":2,
                "JobFiles": [
                    {
                        "JobTypeId": "Ftp",
                        "FileName": "Loopys Towels daily ftp",
                        "Customer": "Next3pl",
                        "JobName": "Ftp Reports",
                        "JobId": 1,
                        "Data": {
                            "Host": "ftp.nextlogistics.info",
                            "UserName": "rock_your_baby@nextlogistics.info",
                            "Password": "*I&YTfr3",
                            "Folder": "/outtest",
                            "ReportItems": [
                                {
                                    "ReportId": "StockOnHand",
                                    "TemplateId": "48",
                                    "FileName": "[@DATESTAMP@]_HIIIII.csv",
                                    "Parameters": {
                                        "showZeroStockItems": "true"
                                    }
                                }
                            ],
                            "NextAccountId": 1434,
                            "AccountId": 1080,
                            "AccountName": "Rock Your Baby",
                            "Id": "Ftp Reports"
                        }
                    },
                    {
                        "JobTypeId": "Email",
                        "FileName": "Loopys Towels daily ftp",
                        "Customer": "Next3pl",
                        "JobName": "Daily Reports",
                        "JobId": 2,
                        "Data": {
                            "Subject": "AmpleFolk - Daily Reports - [@DATESTAMP@]",
                            "Recipients": [
                                {
                                    "Address": "jenish.baldha@next3pl.com"
                                }
                            ],
                            "ReportItems": [
                                {
                                    "ReportId": "AllOrders",
                                    "FileName": "[@DATESTAMP@]_orders.xlsx"
                                },
                                {
                                    "ReportId": "ShippedOrders",
                                    "FileName": "[@DATESTAMP@]_shipped_orders.xlsx"
                                },
                                {
                                    "ReportId": "PendingReceipts",
                                    "FileName": "[@DATESTAMP@]_receipts_pending.xlsx"
                                },
                                {
                                    "ReportId": "ProcessedReceipts",
                                    "FileName": "[@DATESTAMP@]_receipts_processed.xlsx"
                                },
                                {
                                    "ReportId": "StockOnHand",
                                    "FileName": "[@DATESTAMP@]_stock.xlsx",
                                    "Parameters": {
                                        "showZeroStockItems": "false"
                                    }
                                },
                                {
                                    "ReportId": "Kits",
                                    "FileName": "[@DATESTAMP@]_kits.xlsx"
                                }
                            ],
                            "NextAccountId": 1795,
                            "AccountId": 979,
                            "AccountName":"AQS",
                            "Id": "Daily Reports"
                        }
                    },



                ]
            },
            {
                "Name": "WH3 Test FTP 2",
                "BatchId":2,
                "date":'2024-02-08',
                "time": "2am",
                "BatchTimeType": 2,
                "BatchTimeName": "week",
                "BatchTimeValue": "monday",
                "TotalJob":4,
                "JobFiles": [
                    {
                        "JobTypeId": "Ftp",
                        "FileName": "Loopys Towels daily ftp",
                        "Customer": "Next3pl",
                        "JobName": "Ftp Reports",
                        "JobId": 3,
                        "Data": {
                            "Host": "ftp.nextlogistics.info",
                            "UserName": "rock_your_baby@nextlogistics.info",
                            "Password": "*I&YTfr3",
                            "Folder": "/outtest",
                            "ReportItems": [
                                {
                                    "ReportId": "StockOnHand",
                                    "TemplateId": "48",
                                    "FileName": "[@DATESTAMP@]_HIIIII.csv",
                                    "Parameters": {
                                        "showZeroStockItems": "true"
                                    }
                                }
                            ],
                            "NextAccountId": 1434,
                            "AccountId": 1080,
                            "AccountName": "Rock Your Baby",
                            "Id": "Ftp Reports"
                        }
                    },
                    {
                        "JobTypeId": "Ftp",
                        "FileName": "Panzera daily ftp",
                        "Customer": "Next3pl",
                        "JobName": "Ftp Reports",
                        "JobId": 4,
                        "Data": {
                            "Host": "ftp.nextlogistics.info",
                            "UserName": "rock_your_baby@nextlogistics.info",
                            "Password": "*I&YTfr3",
                            "Folder": "/outtest",
                            "ReportItems": [
                                {
                                    "ReportId": "StockOnHand",
                                    "TemplateId": "48",
                                    "FileName": "[@DATESTAMP@]_HIIIII.csv",
                                    "Parameters": {
                                        "showZeroStockItems": "true"
                                    }
                                }
                            ],
                            "NextAccountId": 1434,
                            "AccountId": 1080,
                            "AccountName": "Rock Your Baby",
                            "Id": "Ftp Reports"
                        }
                    },
                    {
                        "JobTypeId": "Ftp",
                        "FileName": "Eve Skincare daily ftp",
                        "Customer": "Next3pl",
                        "JobName": "Ftp Reports",
                        "JobId": 5,
                        "Data": {
                            "Host": "ftp.nextlogistics.info",
                            "UserName": "rock_your_baby@nextlogistics.info",
                            "Password": "*I&YTfr3",
                            "Folder": "/outtest",
                            "ReportItems": [
                                {
                                    "ReportId": "StockOnHand",
                                    "TemplateId": "48",
                                    "FileName": "[@DATESTAMP@]_HIIIII.csv",
                                    "Parameters": {
                                        "showZeroStockItems": "true"
                                    }
                                }
                            ],
                            "NextAccountId": 1434,
                            "AccountId": 1080,
                            "AccountName": "Rock Your Baby",
                            "Id": "Ftp Reports"
                        }
                    },
                    {
                        "JobTypeId": "Ftp",
                        "FileName": "Security Door Stop daily ftp",
                        "Customer": "Next3pl",
                        "JobName": "Ftp Reports",
                        "JobId": 6,
                        "Data": {
                            "Host": "ftp.nextlogistics.info",
                            "UserName": "rock_your_baby@nextlogistics.info",
                            "Password": "*I&YTfr3",
                            "Folder": "/outtest",
                            "ReportItems": [
                                {
                                    "ReportId": "StockOnHand",
                                    "TemplateId": "48",
                                    "FileName": "[@DATESTAMP@]_HIIIII.csv",
                                    "Parameters": {
                                        "showZeroStockItems": "true"
                                    }
                                }
                            ],
                            "NextAccountId": 1434,
                            "AccountId": 1080,
                            "AccountName": "Rock Your Baby",
                            "Id": "Ftp Reports"
                        }
                    },
                ]
            }
        ]
        return new Promise((resolve, reject) => {
            resolve(data)
            this.batchListData=data;
            //   this._httpClient.get(environment.phUrl + `/api/log/dashboard/cardcount`)
            //     .subscribe((response: any) => {
            //       resolve(response);
            //     }, reject);
        });
    }

    getIndividuleJobData(): Promise<any> {
        let data = {
            "Host": "ftp.nextlogistics.info",
            "UserName": "rock_your_baby@nextlogistics.info",
            "Password": "*I&YTfr3",
            "Folder": "/outtest",
            "ReportItems": [
                {
                    "ReportId": "StockOnHand",
                    "TemplateId": "48",
                    "FileName": "[@DATESTAMP@]_HIIIII.csv",
                    "Parameters": {
                        "showZeroStockItems": "true"
                    }
                }
            ],
            "NextAccountId": 1434,
            "AccountId": 1080,
            "Id": "Ftp Reports"
        }
        return new Promise((resolve, reject) => {
            resolve(data)
            //   this._httpClient.get(environment.phUrl + `/api/log/dashboard/cardcount`)
            //     .subscribe((response: any) => {
            //       resolve(response);
            //     }, reject);
        });

    }

    getEmailData(): Promise<any> {
        let data = [
            {
                "Subject": "AmpleFolk - Daily Reports - [@DATESTAMP@]",
                "Recipients": [
                    {
                        "Address": "jenish.baldha@next3pl.com"
                    }
                ],
                "ReportItems": [
                    {
                        "ReportId": "AllOrders",
                        "FileName": "[@DATESTAMP@]_orders.xlsx"
                    },
                    {
                        "ReportId": "ShippedOrders",
                        "FileName": "[@DATESTAMP@]_shipped_orders.xlsx"
                    },
                    {
                        "ReportId": "PendingReceipts",
                        "FileName": "[@DATESTAMP@]_receipts_pending.xlsx"
                    },
                    {
                        "ReportId": "ProcessedReceipts",
                        "FileName": "[@DATESTAMP@]_receipts_processed.xlsx"
                    },
                    {
                        "ReportId": "StockOnHand",
                        "FileName": "[@DATESTAMP@]_stock.xlsx",
                        "Parameters": {
                            "showZeroStockItems": "false"
                        }
                    },
                    {
                        "ReportId": "Kits",
                        "FileName": "[@DATESTAMP@]_kits.xlsx"
                    }
                ],
                "NextAccountId": 1795,
                "AccountId": 1455,
                "Id": "Daily Reports"
            }, {
                "Subject": "AmpleFolk - Daily Reports - [@DATESTAMP@]",
                "Recipients": [
                    {
                        "Address": "jenish.baldha@next3pl.com"
                    }
                ],
                "ReportItems": [
                    {
                        "ReportId": "AllOrders",
                        "FileName": "[@DATESTAMP@]_orders.xlsx"
                    },
                    {
                        "ReportId": "ShippedOrders",
                        "FileName": "[@DATESTAMP@]_shipped_orders.xlsx"
                    },
                    {
                        "ReportId": "PendingReceipts",
                        "FileName": "[@DATESTAMP@]_receipts_pending.xlsx"
                    },
                    {
                        "ReportId": "ProcessedReceipts",
                        "FileName": "[@DATESTAMP@]_receipts_processed.xlsx"
                    },
                    {
                        "ReportId": "StockOnHand",
                        "FileName": "[@DATESTAMP@]_stock.xlsx",
                        "Parameters": {
                            "showZeroStockItems": "false"
                        }
                    },
                    {
                        "ReportId": "Kits",
                        "FileName": "[@DATESTAMP@]_kits.xlsx"
                    }
                ],
                "NextAccountId": 1795,
                "AccountId": 1455,
                "Id": "Daily Reports"
            }
        ]
        return new Promise((resolve, reject) => {
            resolve(data)
            //   this._httpClient.get(environment.phUrl + `/api/log/dashboard/cardcount`)
            //     .subscribe((response: any) => {
            //       resolve(response);
            //     }, reject);
        });

    }

    addUpdateBatch(body: any): Promise<any> {
        console.log(body)
        return new Promise((resolve, reject) => {
            // this._httpClient
            //     .post(environment.phUrl + `/api/report/updateAddBatch`, body)
            //     .subscribe((response: any) => {
            //         resolve(response);
            //     }, reject);
        });
    }
}
