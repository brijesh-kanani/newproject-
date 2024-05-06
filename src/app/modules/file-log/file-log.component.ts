import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { MatButtonModule } from '@angular/material/button';
import { SnackBar } from 'app/layout/common/snack-bar/snack-bar.class';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FileLogFilterComponent } from './file-log-filter/file-log-filter.component';
import { ViewSummaryDialogComponent } from './view-summary-dialog/view-summary-dialog.component';
import { FileLogService } from './file-log.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import moment from 'moment';
import { ViewErrorDialogComponent } from './view-error-dialog/view-error-dialog.component';
import { SharedService } from 'app/mock-api/common/shared.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { saveAs } from 'file-saver';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'environments/environment';
import { DashboardService } from '../dashboard/dashboard.service';

@Component({
    selector: 'app-file-log',
    templateUrl: './file-log.component.html',
    styleUrls: ['./file-log.component.scss'],
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    imports: [
        MatTooltipModule,
        MatButtonModule,
        NgApexchartsModule,
        NgIf,
        NgFor,
        CommonModule,
        MatIconModule,
        MatTableModule,
        MatCheckboxModule,
        MatPaginatorModule,
        MatSortModule,
        FileLogFilterComponent,
        MatSnackBarModule
    ],
})
export class FileLogComponent {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    displayedColumns: any = [
        'customerName',
        'fileName',
        'fileType',
        'uploadDate',
        'inProgress',
        'total_orders',
        'total_lines',
        'success',
        'isError',
        'actions',
    ];
    filteredData: any;
    snackbar: SnackBar;
    filelogList: any = [];
    isDisabled: boolean = true;
    dataSource = new MatTableDataSource;
    showProgressLoader: boolean = false;
    progressTimeoutClearFlag: any;
    timeConfiguration: any;
    private intervalId: any;

    constructor(
        private sharedService: SharedService,
        private _spinner: NgxSpinnerService,
        private filelogService: FileLogService,
        private _router: Router,
        private snack: MatSnackBar,
        private dashboardService: DashboardService
    ) {
        this.snackbar = new SnackBar(snack)
    }

    ngOnInit(): void {
        this.getTimeLimite()
        setTimeout(() => {
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.paginator.pageSize = 20;
            // this.getFileLogList()
        }, 100)
    }

    applyFileLogFilters(filters: any) {
        this._spinner.show()
        if (this.paginator) {
            this.paginator.pageSize = 20;
            this.paginator.pageIndex = 0;
        }
        this.getFileLogList();
    }



    getFileLogList() {
        // this._spinner.show();
        const page = this.paginator?.pageIndex + 1 || 1; // Pagination indexes are zero-based, so add 1
        const pageSize = this.paginator?.pageSize || 20;

        let account: any = []
        if (this.filelogService.filters && this.filelogService.filters.account) {
            account.push(this.filelogService.filters.account)
        }

        let filter = {
            accountNumber: account || [], FromDate: (this.filelogService.filters?.fromDate && moment(this.filelogService.filters?.fromDate).format('YYYY-MM-DD')) || moment(new Date()).format('YYYY-MM-DD'), ToDate: (this.filelogService.filters?.toDate && moment(this.filelogService.filters?.toDate).format('YYYY-MM-DD')) || moment(new Date()).format('YYYY-MM-DD'), page: page, pageSize: pageSize, status: this.filelogService.filters?.status || '', fileType: this.filelogService.filters?.fileType || ''
        }
        this.filelogService.getAllFileLogList(filter).then(
            (response: any) => {
                if (response) {
                    this.filelogList = response.data;
                    this.paginator.length = response.paging.total;
                    this.dataSource = this.filelogList;
                    this._spinner.hide()
                }
            },
            (error) => {
                this._spinner.hide();
                this.snackbar.error('Error while calling the api, please try with refresh button F5')
                // this._router.navigateByUrl('/500-not-found');
                console.error('Error fetching user data:', error);
            }
        );
    }

    viewLog(row: any) {
        this.filelogService.viewLogData = row;
        this._router.navigate(['/file-logs/view-log']);
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.paginator.page.subscribe(() => this.getFileLogList());
    }

    async reUploadFile(row: any) {
        const yes = await this.sharedService.ask('Are you sure you want to re-upload file?')
        if (!yes) return

        if (row && row.file_type == "Receipt") {
            this.filelogService.reUploadFileForReceipt(row).then((res) => {
                this.snackbar.success(res.message)
            }).catch((err) => {
                this.snackbar.error(err.message)
                console.log(err)
            })
        } else {
            this.filelogService.reUploadFile(row).then((res) => {
                this.snackbar.success(res.message)
            }).catch((err) => {
                this.snackbar.error(err.message)
                console.log(err)
            })
        }
    }

    getRowBackgroundColor(row: any): string {
        let isProgress = this.checkIsProgress(row);
        if (isProgress) {
            return '#d0ddf2'; // blue
        } else {
            switch (row.status) {
                case 'success':
                    return '#d3f0d6'; // Green
                case 'warning':
                    return '#f0eed3'; // Yellow
                case 'error':
                    return '#f0d3d7'; // Red
                default:
                    return '#d0ddf2'; // blue -  Default color or you can set another color here
            }
        }
    }

    downloadFile(row: any) {
        this._spinner.show()
        this.filelogService.downloadFile(row).subscribe(
            (response: any) => {
                let fileName: any = response.headers.get('filename')
                if (fileName) {
                    saveAs(response.body, fileName);
                    this.snackbar.success("File downloaded successfully")
                    this._spinner.hide()
                    return;
                }
                this._spinner.hide()

            }, (error) => {
                console.log(error)
                this.snackbar.error('Missing file details')
                this._spinner.hide()
            })
    }

    checkIsProgress(element: any) {
        // if (element.status == 'warning') {
        //     let difference = moment().diff(element.imported_date, 'minutes')
        //     if (!this.progressTimeoutClearFlag) {
        //         this.progressTimeoutClearFlag = setInterval(() => {
        //             let difference = moment().diff(element.imported_date, 'minutes')
        //             if (difference < environment.inProgressTime) {
        //                 return true
        //             } else {
        //                 clearTimeout(this.progressTimeoutClearFlag)
        //                 return false
        //             }
        //         }, 10000)
        //     }
        //     if (difference < environment.inProgressTime) {
        //         return true
        //     }
        // }

        let difference = moment().diff(element.imported_date, 'minutes')
        if (difference < environment.inProgressTime) {
            let totalCount = element.error + element.success
            if (totalCount != element.total_lines && element.status != "error") {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }


    getTimeLimite() {
        if (environment && environment.refreshTimeForFilelog) {
            this.timeConfiguration = environment.refreshTimeForFilelog
            this.getTimeWiseFileListData();

        } else {
            this.timeConfiguration = 10
            this.getTimeWiseFileListData();

        }
        // const user = JSON.parse(localStorage.getItem('user'));
        // if (user && user.IdUser) {
        //     this.dashboardService
        //         .getTimeByUser(user.IdUser)
        //         .then((res: any) => {
        //             if (res.configuration) {
        //                 this.timeConfiguration = res.configuration.time;
        //                 this.getTimeWiseFileListData();
        //             } else {
        //                 let body: any = {
        //                     time: 10,
        //                     IdUser: user.IdUser,
        //                 };
        //                 this.dashboardService
        //                     .setTimeByUser(body)
        //                     .then((data: any) => {
        //                         if (data) {
        //                             this.getTimeLimite();
        //                         }
        //                     })
        //                     .catch((err) => {
        //                         console.log('err while set default time', err);
        //                     });
        //             }
        //         })
        //         .catch((err) => {
        //             console.log(err);
        //         });
        // } else {
        //     this.snackbar.error('User id not found');
        //     this._router.navigate(['/sign-in']);
        // }
    }

    getTimeWiseFileListData() {
        if (this.timeConfiguration) {
            this.intervalId = setInterval(() => {
                this.getFileLogList();
            }, this.timeConfiguration * 1000);
        }
    }
}
