import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { SnackBar } from 'app/layout/common/snack-bar/snack-bar.class';
import { SharedService } from 'app/mock-api/common/shared.service';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReportLogFilterComponent } from './report-log-filter/report-log-filter.component';

@Component({
    selector: 'app-report-log',
    templateUrl: './report-log.component.html',
    styleUrls: ['./report-log.component.scss'],
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    imports: [
        MatTooltipModule,
        MatButtonModule,
        NgIf,
        NgFor,
        CommonModule,
        MatIconModule,
        MatTableModule,
        MatCheckboxModule,
        MatPaginatorModule,
        MatSortModule,
        MatSnackBarModule,
        ReportLogFilterComponent
    ],
})
export class ReportLogComponent {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    displayedColumns: any = [
        'batchName',
        'jobName',
        'reportID',
        'fileName',
        'createdDate',
        'actions',
    ];
    filteredData: any;
    snackbar: SnackBar;
    reportlogList: any = [];
    isDisabled: boolean = true;
    dataSource = new MatTableDataSource;

    constructor(
        private sharedService: SharedService,
        private _spinner: NgxSpinnerService,
        // private filelogService: FileLogService,
        private _router: Router,
        private snack: MatSnackBar
    ) {
        this.snackbar = new SnackBar(snack)
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.paginator.pageSize = 20;
            this.getReportLogList()
        }, 100)
    }

    applyFileLogFilters(filters: any) {
        if (this.paginator) {
            this.paginator.pageSize = 20;
            this.paginator.pageIndex = 0;
        }
        this.getReportLogList();
    }

    getReportLogList() {
        this.reportlogList = [{
            batchName: 'Try Batch Name',
            jobName: 'Try Job Name',
            reportID: '152472',
            fileName: 'Try file',
            createdDate: '09-02-2024',
        },
        {
            batchName: 'pi Batch Name',
            jobName: 'pi Job Name',
            reportID: '124',
            fileName: 'pi file',
            createdDate: '04-02-2024',
        }]
        this.dataSource.data = this.reportlogList
        // this._spinner.show();
        // const page = this.paginator?.pageIndex + 1 || 1; // Pagination indexes are zero-based, so add 1
        // const pageSize = this.paginator?.pageSize || 20;

        // let account: any = []
        // if (this.filelogService.filters && this.filelogService.filters.account) {
        //   account.push(this.filelogService.filters.account)
        // }

        // let filter = {
        //   accountNumber: account || [], FromDate: (this.filelogService.filters?.fromDate && moment(this.filelogService.filters?.fromDate).format('YYYY-MM-DD')) || moment(new Date()).format('YYYY-MM-DD'), ToDate: (this.filelogService.filters?.toDate && moment(this.filelogService.filters?.toDate).format('YYYY-MM-DD')) || moment(new Date()).format('YYYY-MM-DD'), page: page, pageSize: pageSize, status: this.filelogService.filters?.status || ''
        // }
        // this.filelogService.getAllFileLogList(filter).then(
        //   (response: any) => {
        //     if (response) {
        //       this.filelogList = response.data;
        //       this.paginator.length = response.paging.total;
        //       this.dataSource = this.filelogList;
        //       this._spinner.hide()
        //     }
        //   },
        //   (error) => {
        //     this._spinner.hide();
        //     this._router.navigateByUrl('/500-not-found');
        //     console.error('Error fetching user data:', error);
        //   }
        // );
    }

    ngAfterViewInit() {
        this.paginator.page.subscribe(() => this.getReportLogList());
    }


    downloadFile(row: any) {
        //   this._spinner.show()
        //   this.filelogService.downloadFile(row).subscribe(
        //     (response: any) => {
        //       let fileName: any = response.headers.get('filename')
        //       if (fileName) {
        //         saveAs(response.body, fileName);
        //         this.snackbar.success("File downloaded successfully")
        //         this._spinner.hide()
        //         return;
        //       }
        //       this._spinner.hide()

        //     }, (error) => {
        //       console.log(error)
        //       this.snackbar.error('Missing file details')
        //       this._spinner.hide()
        //     })
        // }
    }
}
