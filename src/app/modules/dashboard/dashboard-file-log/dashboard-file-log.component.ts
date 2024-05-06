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
import { MatTooltipModule } from '@angular/material/tooltip'
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import moment from 'moment';
import { SharedService } from 'app/mock-api/common/shared.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { saveAs } from 'file-saver';
import { HttpErrorResponse } from '@angular/common/http';
import { FileLogService } from 'app/modules/file-log/file-log.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-dashboard-file-log',
  templateUrl: './dashboard-file-log.component.html',
  styleUrls: ['./dashboard-file-log.component.scss'],
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
    MatSnackBarModule
  ],
})
export class DashboardFileLogComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns: any = [
    'customerName',
    'fileName',
    'fileType',
    'uploadDate',
    'inProgress',
  ];
  filteredData: any;
  snackbar: SnackBar;
  filelogList: any = [];
  isDisabled: boolean = true;
  dataSource = new MatTableDataSource;
  fromDate: any
  toDate: any

  constructor(
    private sharedService: SharedService,
    private _spinner: NgxSpinnerService,
    private filelogService: FileLogService,
    private _router: Router,
    private snack: MatSnackBar
  ) {
    this.snackbar = new SnackBar(this.snack)
  }

  ngOnInit(): void {
    // setTimeout(() => {
    //   this.dataSource.sort = this.sort;
    //   this.dataSource.paginator = this.paginator;
    //   this.paginator.pageSize = 10;
    //   // this.getFileLogList()
    // }, 100)
  }

  getDashboardFileLog() {
    this.toDate = moment().format('YYYY-MM-DD');
    this.fromDate = moment().subtract(1, 'month').format('YYYY-MM-DD');

    this.getFileLogList();
  }

  getFileLogList() {

    let account: any = []

    let filter = {
      accountNumber: account || [], FromDate: (this.fromDate && moment(this.fromDate).format('YYYY-MM-DD')) || moment(new Date()).format('YYYY-MM-DD'), ToDate: (this.toDate && moment(this.toDate).format('YYYY-MM-DD')) || moment(new Date()).format('YYYY-MM-DD'), page: 1, pageSize: 3, status: '', fileType: ''
    }
    this.filelogService.getAllFileLogList(filter).then(
      (response: any) => {
        if (response) {
          this.filelogList = response.data;
          // this.paginator.length = response.paging.total;
          this.dataSource = this.filelogList;
          // this._spinner.hide()
        }
      },
      (error) => {
        // this._spinner.hide();
        // this._router.navigateByUrl('/500-not-found');
        this.snackbar.error('Error fetching file data')
        console.error('Error fetching user data:', error);
      }
    );
  }

  viewLog(row: any) {
    this.filelogService.viewLogData = row;
    this._router.navigate(['/file-logs/view-log']);
  }

  // ngAfterViewInit() {
  //   this.paginator.page.subscribe(() => this.getFileLogList());
  // }

  async reUploadFile(row: any) {
    const yes = await this.sharedService.ask('Are you sure you want to re-upload file?')
    if (!yes) return
    this.filelogService.reUploadFile(row).then((res) => {
      this.snackbar.success(res.message)
    }).catch((err) => {
      this.snackbar.error(err.message)
      console.log(err)
    })
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

