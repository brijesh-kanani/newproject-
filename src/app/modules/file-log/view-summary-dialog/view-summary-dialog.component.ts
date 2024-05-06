import { Component, Inject, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ApexOptions } from 'apexcharts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FileLogService } from '../file-log.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { saveAs } from 'file-saver';
import { SnackBar } from 'app/layout/common/snack-bar/snack-bar.class';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SharedService } from 'app/mock-api/common/shared.service';
import { MatButtonModule } from '@angular/material/button';
import * as XLSX from 'xlsx';
import { environment } from 'environments/environment';
import moment from 'moment';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
    selector: 'app-view-summary-dialog',
    templateUrl: './view-summary-dialog.component.html',
    styleUrls: ['./view-summary-dialog.component.scss'],
    standalone: true,
    imports: [MatIconModule, NgApexchartsModule, CommonModule, MatTableModule, MatTooltipModule, MatExpansionModule, RouterModule, MatSnackBarModule, MatButtonModule, MatPaginatorModule],
})
export class ViewSummaryDialogComponent {
    @ViewChild('fileLogMatPaginator') fileLogMatPaginator: MatPaginator;
    @ViewChild('fileLineMatPaginator') fileLineMatPaginator: MatPaginator;
    displayedColumns: string[] = [
        'status',
        'createAt',
        'description',
    ];
    fileLogSummarydisplayedColumns: string[] = [
        'startTime',
        'finishTime',
        'totalTime',
        'sucessLines',
        'warningLines',
        'skipLines',
        'totalLines',
    ];
    fileLogDataSource: any = new MatTableDataSource<[]>();
    fileLineLogDataSource: any = new MatTableDataSource<[]>();
    fileLogSummaryDataSource: any = new MatTableDataSource<[]>();
    snackbar: SnackBar;
    progressTimeoutClearFlag: any
    constructor(
        public filelogService: FileLogService,
        public sharedService: SharedService,
        public _spinner: NgxSpinnerService,
        public _router: Router,
        private location: Location,
        private snack: MatSnackBar
    ) {
        this.snackbar = new SnackBar(snack)
    }

    ngOnInit() {
        if (this.filelogService.viewLogData) {
            setTimeout(() => {
                this.fileLogDataSource.paginator = this.fileLogMatPaginator;
                this.fileLineLogDataSource.paginator = this.fileLineMatPaginator;
                this.fileLogMatPaginator.pageSize = 20
                this.fileLineMatPaginator.pageSize = 20
                this.getFileLogData();
            }, 100)
        } else {
            this._router.navigateByUrl('/file-logs')
        }
    }

    checkBgcolor() {
        let isProgress = this.checkIsProgress(this.filelogService.viewLogData);
        if (isProgress) {
            return 'bg-blue-400'; // blue
        } else {
            if (this.filelogService.viewLogData) {
                if (this.filelogService.viewLogData.status == 'error') {
                    return 'bg-red-500'
                } else if (this.filelogService.viewLogData.status == 'warning') {
                    return 'bg-yellow-500'
                } else if (this.filelogService.viewLogData.status == 'success') {
                    return 'bg-green-500'
                }
            }
        }
    }

    getFileLogData() {
        if (this.filelogService.viewLogData && this.filelogService.viewLogData.id) {
            let fileId = this.filelogService.viewLogData.id
            this._spinner.show()
            this.filelogService.getFileLogData(fileId).then(
                (response: any) => {
                    if (response) {
                        let filteredStatusLogArray: any = JSON.parse(response.fileStatusLog.statusLog).sort((a: any, b: any) => a.statusId - b.statusId)
                        this.fileLogDataSource.data = filteredStatusLogArray.filter(entry => entry.statusId !== 1);
                        this.fileLineLogDataSource.data = JSON.parse(response.fileStatusLog.statusLog1).sort((a: any, b: any) => a.statusId - b.statusId)
                        this.fileLogSummaryDataSource = response.fileSummary
                        this.fileLogDataSource.paginator.length = filteredStatusLogArray.length;
                        this.fileLineLogDataSource.paginator.length = JSON.parse(response.fileStatusLog.statusLog1).sort((a: any, b: any) => a.statusId - b.statusId).length;
                    }
                    this._spinner.hide()
                },
                (error) => {
                    this._spinner.hide();
                    this._router.navigateByUrl('/500-not-found');
                    console.error('Error fetching user data:', error);
                }
            );
        } else {
            this._router.navigateByUrl('/file-logs')
        }
    }

    goBack() {
        this.location.back();
    }

    getRowBackgroundColorFileLineLog(row: any): string {
        switch (row.statusId) {
            case 8:
            case 11:
                return '#f0d3d7'; // Red
            case 9:
                return '#f0eed3'; // yello
            default:
                return ''; // Default color or you can set another color here
        }
    }

    getRowBackgroundColorFileLog(row: any): string {
        switch (row.statusId) {
            case 8:
            case 11:
            case 9:
                return '#f0d3d7'; // Red
            default:
                return ''; // Default color or you can set another color here
        }
    }

    downloadFile() {
        this._spinner.show()
        this.filelogService.downloadFile(this.filelogService.viewLogData).subscribe(
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

    downloadFileLog() {
        if (this.fileLineLogDataSource && this.fileLineLogDataSource.filteredData && this.fileLineLogDataSource.filteredData.length > 0) {
            const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.fileLineLogDataSource.filteredData);
            const wb: XLSX.WorkBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

            // Save the Excel file
            XLSX.writeFile(wb, 'filelog-' + this.filelogService?.viewLogData?.file_name);
        } else {
            this.snackbar.error('File line log not found or empty ')
        }
        // this._spinner.show()
        // this.filelogService.downloadFile(this.filelogService.viewLogData).subscribe(
        //     (response: any) => {
        //         let fileName: any = response.headers.get('filename')
        //         if (fileName) {
        //             saveAs(response.body, fileName);
        //             this.snackbar.success("File downloaded successfully")
        //             this._spinner.hide()
        //             return;
        //         }
        //         this._spinner.hide()

        //     }, (error) => {
        //         console.log(error)
        //         this.snackbar.error('Missing file details')
        //         this._spinner.hide()
        //     })
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

    checkIsProgress(element: any) {
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
}
