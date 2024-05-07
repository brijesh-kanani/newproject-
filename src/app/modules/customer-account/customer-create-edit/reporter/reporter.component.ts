import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AngularCommonModule } from 'app/mock-api/common/angular-common.modules';
import { CustomerAccountService } from '../../customer-account.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { startWith, map } from 'rxjs';
import { BatchesService } from 'app/modules/reports/batches/batches.service';
import { CreateEditReporterComponent } from './create-edit-reporter/create-edit-reporter.component';
import { ReporterService } from './reporter.service';

@Component({
    selector: 'app-reporter',
    templateUrl: './reporter.component.html',
    styleUrls: ['./reporter.component.scss'],
    standalone: true,
    imports: [AngularCommonModule, CreateEditReporterComponent],
})
export class ReporterComponent {
    dataSource = new MatTableDataSource();
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    displayedColumns: string[] = ['fileNameOnly', 'JobTypeId', 'action'];
    filterForm: FormGroup;
    accountList: any;
    batchList: any;
    filterAccountList: any;
    filterBatchList: any;
    searchAccount = new FormControl('');
    searchBatch = new FormControl('');
    apiData: any;
    jobListShow: boolean = true;
    createEditShow: boolean = false;
    accountNumber: number;
    constructor(
        public customerAccountService: CustomerAccountService,
        private _spinner: NgxSpinnerService,
        private fb: FormBuilder,
        public batchesService: BatchesService,
        public reporterService: ReporterService
    ) {}

    ngOnInit() {
        setTimeout(() => {
            if (this.paginator) {
                this.paginator.pageSize = 500;
                this.paginator.pageIndex = 0;
            }

            this.dataSource.sort = this.sort;

            // this.setJobList();
            // this.getAccountList();
            // this.getBatchList();
        }, 100);

        this.filterForm = this.fb.group({
            name: [''],
            type: [''],
            account: [''],
            customerName: [''],
            selectBatch: [''],
        });
        this.reporterService.page.subscribe((ress) => {
            if (ress === 'ListPage') {
                this.jobListShow = true;
                this.createEditShow = false;
            }
        });

        if (
            this.customerAccountService.editCrateUser &&
            this.customerAccountService.editCrateUser.user
        ) {
            this.accountNumber =
                this.customerAccountService.editCrateUser.user.AccountNumber;
            console.log(this.accountNumber, 'aaaa');
        }

        this.getJobForAccount();
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
        this.jobListShow = false;
        this.createEditShow = true;
        let obj = { type: 'create' };
        this.batchesService.jobDetailsData = obj;
        this.batchesService.accountList = this.accountList;
        // this._router.navigate(['/reports/jobs/details'])
    }
    editJob() {}
    getJobForAccount() {
        this._spinner.show();
        this.customerAccountService
            .getJobsByAccount(this?.accountNumber)
            .then((response) => {
                this.dataSource.data = response.data;
                this._spinner.hide();
            })
            .catch((e) => {
                this._spinner.hide();
                // console.log(e.error.message, 'error');
            });
    }
}
