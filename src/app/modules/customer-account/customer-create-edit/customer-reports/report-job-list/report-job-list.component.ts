import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { BatchesService } from 'app/modules/reports/batches/batches.service';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
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
import { CommonModule, Location } from '@angular/common';
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
import { CustomerAccountService } from 'app/modules/customer-account/customer-account.service';
import { map, startWith } from 'rxjs';
import moment from 'moment';

@Component({
    selector: 'app-report-job-list',
    templateUrl: './report-job-list.component.html',
    styleUrls: ['./report-job-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatMenuModule,
        MatSnackBarModule,

        MatExpansionModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule,
        MatTooltipModule,
        MatCheckboxModule,
    ],
})
export class ReportJobListComponent {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    dataSource = new MatTableDataSource();
    viewMappingData: any = [];
    displayedColumns: string[] = [
        'fileNameOnly',
        'customer',
        'AccountName',
        'JobTypeId',
        'action',
    ];
    customerList: any = [];
    filteredData: any = [];
    totalItemCount: number;
    snackBar: SnackBar;
    apiData: any;
    dataDetails: any;
    mainData: any;
    users: any = [];
    searchAccount = new FormControl('');
    searchBatch = new FormControl('');
    accountList: any;
    batchList: any;
    filterAccountList: any;
    filterBatchList: any;
    accountNumber: number;
    constructor(
        private snack: MatSnackBar,
        private dialog: MatDialog,
        private _router: Router,
        private _spinner: NgxSpinnerService,
        private sharedService: SharedService,
        public batchesService: BatchesService,
        private importService: ImportService,
        private cdr: ChangeDetectorRef,
        private fileLogService: FileLogService,
        private fb: FormBuilder,
        private location: Location,
        private customerAccountService: CustomerAccountService
    ) {
        this.snackBar = new SnackBar(snack);
    }

    jobList = [
        { name: 'Ftp', value: 'Ftp' },
        { name: 'Email', value: 'Email' },
        { name: 'All', value: '' },
    ];

    onKeydown(e: KeyboardEvent, i: HTMLInputElement) {
        i.onkeydown?.(e);
        e.stopPropagation();
    }
    filterForm: FormGroup;

    ngOnInit() {
        setTimeout(() => {
            if (this.paginator) {
                this.paginator.pageSize = 500;
                this.paginator.pageIndex = 0;
            }

            this.dataSource.sort = this.sort;

            // this.setJobList();
            this.getAccountList();
            this.getBatchList();
        }, 100);

        this.filterForm = this.fb.group({
            name: [''],
            type: [''],
            account: [''],
            customerName: [''],
            selectBatch: [''],
        });

        if (
            this.customerAccountService.editCrateUser &&
            this.customerAccountService.editCrateUser.user
        ) {
            this.accountNumber =
                this.customerAccountService.editCrateUser.user.AccountNumber;
            console.log(this.accountNumber, 'aaaa');
        }
    }

    private _filterAccountName(name: string): any[] {
        const filterValue = name.toLowerCase();
        return this.accountList.filter((option) =>
            option.AccountName.toLowerCase().includes(filterValue.toLowerCase())
        );
    }

    private _filterBatchName(name: string): any[] {
        const filterValue = name.toLowerCase();
        return this.batchList.filter((option) =>
            option.Name.toLowerCase().includes(filterValue.toLowerCase())
        );
    }

    async getAccountList() {
        this._spinner.show();
        let filter = { name: '', status: 'all' };
        await this.customerAccountService
            .getAccountList(filter)
            .then((response) => {
                if (response) {
                    this.accountList = response.account;
                    this.filterAccountList =
                        this.searchAccount.valueChanges.pipe(
                            startWith<string | any>(''),
                            map((value) =>
                                typeof value === 'string' ? value : value
                            ),
                            map((name) =>
                                name
                                    ? this._filterAccountName(name)
                                    : this.accountList.slice()
                            )
                        );
                    setTimeout(() => {
                        this._spinner.hide();
                    }, 500);
                }
            })
            .catch((e) => {
                this._spinner.hide();
                console.log(e.error.message, 'error');
            });
        // this.checkExitAccount()
    }

    async getBatchList() {
        this._spinner.show();
        let data: any = [];
        this.batchesService
            .getBatchData()
            .then(async (response) => {
                response.map((item: any) => {
                    if (item.JobFiles) {
                        item.JobFiles.map((file: any) => {
                            data.push(file);
                        });
                    }
                });
                this.dataSource.data = data;
                if (response) {
                    this.apiData = response;
                    this.batchList = response;
                    this.filterBatchList = this.searchBatch.valueChanges.pipe(
                        startWith<string | any>(''),
                        map((value) =>
                            typeof value === 'string' ? value : value
                        ),
                        map((name) =>
                            name
                                ? this._filterBatchName(name)
                                : this.batchList.slice()
                        )
                    );
                    setTimeout(() => {
                        this._spinner.hide();
                    }, 500);
                }
            })
            .catch((e) => {
                this._spinner.hide();
            });
    }
    // async fileNameChange(data: any) {
    //     let array: any = []
    //     await data?.JobFiles?.map((item: any) => {
    //         let fileName = item.FileName.split('ftp\\')[1].split('.json')[0]
    //         array.push({ ...item, fileNameOnly: fileName })
    //     })

    //     return array
    // }

    async applyFilters() {
        const page = this.paginator?.pageIndex + 1 || 1; // Pagination indexes are zero-based, so add 1
        const pageSize = this.paginator?.pageSize || 20;

        let filter = {
            batcheName: this.filterForm.value.name || '',
            type: this.filterForm.value.type || '',
            account: this.filterForm.value.account || '',
            customerName: this.filterForm.value.customerName || '',
            selectBatch: this.filterForm.value.selectBatch || '',
            page: page,
            pageSize: pageSize,
        };
        // console.log(filter, 'job filter')
        const filters = this.filterForm.value;
        // if (!filters.selectBatch) {
        //     this.snackBar.error('Please select batch in job filter')
        // }
        // if ((filters?.name || filters?.type || filters?.account || filters?.selectBatch) && this.apiData?.length > 0) {
        //     let newArr: any = []
        //     newArr = this.apiData?.filter((item: any) => {
        //         // let nameCondition = !filters?.name || item?.FileName?.toLowerCase().includes(this.filterForm.value?.name?.toLowerCase());
        //         // let typeCondition = !filters?.type || item.JobTypeId === filters?.type;
        //         // let accountCondition = !filters?.account || filters.account == item?.Data?.AccountId;
        //         let selectBatch = filters.selectBatch == item?.BatchId;
        //         return selectBatch;
        //     });
        //     console.log(newArr[0].JobFiles,'newArr')
        //     this.dataDetails = newArr[0]
        //     this.batchesService.storeData = newArr[0]
        //     // let data: any = await this.fileNameChange(newArr[0])
        //     this.dataSource.data = newArr[0].JobFiles;
        //     if (this.paginator) {
        //         this.paginator.pageSize = 500;
        //         this.paginator.pageIndex = 0;
        //     }
        // }
        // this.filtersApplied.emit(filters);
    }

    onPageChange(event: any) {
        if (this.apiData?.length > 0 && this.apiData?.length > 0) {
            this.getGroupData(event);
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
        this.totalItemCount =
            (this.apiData.length > 0 && this.apiData.length) || 500;
    }

    async setJobList() {
        console.log(
            this.batchesService.storeData,
            'this.batchesService.storeData'
        );
        this._spinner.show();
        if (this.batchesService.storeData?.JobFiles) {
            this.dataDetails = this.batchesService.storeData;
            // let data: any = await this.fileNameChange(this.batchesService.storeData)
            this.dataSource.data = this.batchesService.storeData.slice(0, 500);
            this.totalItemCount =
                (this.batchesService.storeData.length > 0 &&
                    this.batchesService.storeData.length) ||
                500;
            this.filterForm.patchValue({
                selectBatch: this.batchesService.storeData.BatchId,
            });
        }
        this._spinner.hide();
        this.applyFilters();
    }

    createJob() {
        // const filters = this.filterForm.value;
        // if (!filters.selectBatch) {
        //     this.snackBar.error('Please select batch in job filter')
        // } else {
        //     // this.batchesService.jobDetailsData = data;
        //     let obj = { type: 'create' }
        //     this.batchesService.jobDetailsData = obj;
        //     this.batchesService.accountList = this.accountList;
        //     this._router.navigate(['/reports/jobs/details'])
        // }
        let obj = { type: 'create' };
        this.batchesService.jobDetailsData = obj;
        this.batchesService.accountList = this.accountList;
        this._router.navigate(['/reports/jobs/details']);
    }

    editJob(data: any) {
        let obj = { type: 'edit', data };
        this.batchesService.jobDetailsData = obj;
        this.batchesService.accountList = this.accountList;
        this._router.navigate(['/reports/jobs/details']);
    }

    viewMapping(data: any) {
        // this.dialog.open(ViewMappingDialogComponent, {
        //   data: this.viewMappingData.mappingAttributes,
        //   width: '100%',
        // })
    }

    viewFileLog(data: any) {
        this.fileLogService.filters.account = data.AccountNumber;
        this._router.navigate(['/file-logs']);
    }

    goBack() {
        this.location.back();
    }
}
