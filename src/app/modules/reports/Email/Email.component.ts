import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { BatchesService } from 'app/modules/reports/batches/batches.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackBar } from 'app/layout/common/snack-bar/snack-bar.class';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DashboardService } from 'app/modules/dashboard/dashboard.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ImportService } from 'app/modules/customer-account/customer-create-edit/customer-mapping/import.service';
import { FileLogService } from 'app/modules/file-log/file-log.service';
import { SharedService } from 'app/mock-api/common/shared.service';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CustomerFtpEditComponent } from 'app/modules/customer-account/customer-create-edit/customer-ftp-details/customer-ftp-edit/customer-ftp-edit.component';
import { EmailEditComponent } from './email-edit/email-edit.component';

@Component({
    selector: 'jobs',
    templateUrl: './Email.component.html',
    styleUrls: ['./Email.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CommonModule, MatIconModule, MatTableModule, MatPaginatorModule, MatSortModule, MatMenuModule, MatSnackBarModule, EmailComponent
        , MatExpansionModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule, MatTooltipModule, MatCheckboxModule],
})


export class EmailComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    dataSource = new MatTableDataSource();
    viewMappingData: any = []
    displayedColumns: string[] = ['email', 'subject', 'reportsCount','action'];
    customerList: any = [];
    filteredData: any = [];
    totalItemCount: number;
    snackBar: SnackBar
    apiData: any
    mainData: any
    users: any = [
    ];
    constructor(private snack: MatSnackBar, private dialog: MatDialog, private _router: Router, private _spinner: NgxSpinnerService, private sharedService: SharedService, private batchesService: BatchesService, private importService: ImportService, private cdr: ChangeDetectorRef, private fileLogService: FileLogService, private fb: FormBuilder) {
        this.snackBar = new SnackBar(snack)
    }

    jobList = [
        { name: 'Ftp', value: 'FtpReportJob' },
        { name: 'Sftp', value: 'SftpReportJob' },
        { name: 'All', value: '' },
    ];
    filterForm: FormGroup;

    ngOnInit() {
        setTimeout(() => {
            if (this.paginator) {
                this.paginator.pageSize = 500;
                this.paginator.pageIndex = 0;
            }

            this.dataSource.sort = this.sort;

            this.getAccountList();
        }, 100)

        this.filterForm = this.fb.group({
            subject: [''],
            email: [''],
        });

    }

    applyFilters() {
        const filters = this.filterForm.value;
        console.log(filters)
        if ((filters?.subject || filters?.email) && this.apiData?.length > 0) {
            // console.log(this.apiData[0]?.JobFiles)
            let newArr=[]
            if(filters?.subject && filters?.email){
                newArr = this.apiData?.filter((item: any) => item?.Subject?.toLowerCase().includes(this.filterForm.value?.subject?.toLowerCase()) && item?.Recipients[0]?.Address===filters?.email)
            }else if(filters?.subject){
                newArr = this.apiData?.filter((item: any) => item?.Subject?.toLowerCase().includes(this.filterForm.value?.subject?.toLowerCase()))
            }else if(filters?.email){
                newArr = this.apiData?.filter((item: any) =>  item?.Recipients[0]?.Address===filters?.email)
            }
            // let newArr = this.apiData?.filter((item: any) => item?.FileName?.toLowerCase().includes(this.filterForm.value?.name?.toLowerCase()))
            // console.log(newArr, 'newArr')
            this.dataSource.data = newArr;
            if (this.paginator) {
                this.paginator.pageSize = 500;
                this.paginator.pageIndex = 0;
            }
        } else {
            this.dataSource.data = this.apiData;
            if (this.dataSource.paginator) {
                this.dataSource.paginator.length = this.apiData.length;
            }
        }

        // this.filtersApplied.emit(filters);
    }

    onPageChange(event: any) {
        if (this.apiData?.length > 0 && this.apiData?.length > 0) {
            this.getGroupData(event)
        }
    }

    async getGroupData(event: any) {
        // console.log('c1');
        // console.log(this.searchData);
        const page = event?.pageIndex + 1 || 1; // Pagination indexes are zero-based, so add 1
        const pageSize = event?.pageSize || 500;
        // console.log(page, pageSize);
        // console.log(page, pageSize);
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        this.dataSource.data = this.apiData.slice(startIndex, endIndex);
        // this.paginator = response[0].JobFiles.length;
        this.totalItemCount = this.apiData.length > 0 && this.apiData.length || 500
    }


    async getAccountList() {
        // let filter = { name: this.filteredData?.name || '', status: this.filteredData?.status || 'active' }
        // this.batchesService.storeData=null;

        this.batchesService.getEmailData().then(async(response) => {
            console.log(response, 'ss')
            this._spinner.hide()
            if (response && response.length > 0) {
                this.paginator.pageSize = 500;
                this.paginator.pageIndex = 0;
                // let filterArr= []
                // await response[0].JobFiles.map((item:any)=>{
                //     let fileName=item.FileName.split('ftp\\')[1].split('.json')[0]
                //     console.log(fileName,'fileName')
                //     filterArr.push({...item,fileNameOnly:fileName})
                // })
                // console.log(filterArr)
                this.apiData = response
                this.mainData = response
                this.dataSource.data = this.apiData.slice(0, 500);
                // this.paginator = response[0].JobFiles.length;
                this.totalItemCount = response.length > 0 && response.length || 500
                this._spinner.hide()
            }
        }).catch((e) => {
            this._spinner.hide()
            //   console.log(e.error.message, 'error')
        })
    }


    createFTP() {

        const dialogRef = this.dialog.open(EmailEditComponent, {
            width: '100%',
            data: { action: 'create', }
        })
        dialogRef.afterClosed().subscribe((data) => {
            if (data) {
                // this.getFTPList()
            }
        })
        // this._spinner.show()
        // this.batchesService.getIndividuleJobData().then(async (response) => {
        //     console.log(response, 'ss')
        //     this._spinner.hide()
        //     if (response && response.Id) {

        //         this._spinner.hide()
        //     }
        // }).catch((e) => {
        //     this._spinner.hide()
        //     //   console.log(e.error.message, 'error')
        // })


    }
    editFTP(data: any) {

        this._spinner.show()
        this.batchesService.getIndividuleJobData().then(async (response) => {
            console.log(response, 'ss')
            this._spinner.hide()
            if (response && response.Id) {
                const dialogRef = this.dialog.open(EmailEditComponent, {
                    width: '100%',
                    data: { action: 'edit', data: response }
                })
                dialogRef.afterClosed().subscribe((data) => {
                    if (data) {
                        // this.getFTPList()
                    }
                })
                this._spinner.hide()
            }
        }).catch((e) => {
            this._spinner.hide()
            //   console.log(e.error.message, 'error')
        })


    }


    viewMapping(data: any) {
        // this.dialog.open(ViewMappingDialogComponent, {
        //   data: this.viewMappingData.mappingAttributes,
        //   width: '100%',
        // })
    }

    applyCustomerFilters(filters: any) {
        this.filteredData = filters
        if (this.paginator) {
            this.paginator.pageSize = 20;
            this.paginator.pageIndex = 0;
        }
        this.getAccountList()
    }

    viewFileLog(data: any) {
        this.fileLogService.filters.account = data.AccountNumber;
        this._router.navigate(['/file-logs'])
    }
}
