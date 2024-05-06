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
import { BatchAddEditComponent } from './Batches-add-edit/batches-add-edit.component';
import moment from 'moment';

@Component({
    selector: 'batches',
    templateUrl: './batches.component.html',
    styleUrls: ['./batches.component.scss'],
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
        BatchesComponent,
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
        BatchAddEditComponent,
    ],
})
export class BatchesComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    dataSource = new MatTableDataSource();
    viewMappingData: any = [];
    displayedColumns: string[] = ['Name', 'TotalJob', 'action'];
    customerList: any = [];
    filteredData: any = [];
    totalItemCount: number;
    snackBar: SnackBar;
    apiData: any;
    mainData: any;
    users: any = [];
    constructor(
        private snack: MatSnackBar,
        private dialog: MatDialog,
        private _router: Router,
        private _spinner: NgxSpinnerService,
        private sharedService: SharedService,
        private batchesService: BatchesService,
        private importService: ImportService,
        private cdr: ChangeDetectorRef,
        private fileLogService: FileLogService,
        private fb: FormBuilder
    ) {
        this.snackBar = new SnackBar(snack);
    }

    // statusList = [
    //     { name: '1 AM', value: '1am' },
    //     { name: '2 AM', value: '2am' },
    //     { name: '3 AM', value: '3am' },
    //     { name: 'All', value: '' },
    // ];
    selectTimeList = [
        { name: 'Day', value: 'day', id: '1' },
        { name: 'Week', value: 'week', id: '2' },
        { name: 'Month', value: 'month', id: '3' },
    ];
    filterForm: FormGroup;

    ngOnInit() {
        setTimeout(() => {
            if (this.paginator) {
                this.paginator.pageSize = 500;
                this.paginator.pageIndex = 0;
            }

            this.dataSource.sort = this.sort;

            this.getBatchList();
        }, 100);

        this.filterForm = this.fb.group({
            name: [''],
            status: [''],
            fromDate: [''],
            toDate: [''],
        });
    }

    addBatch() {
        this._router.navigate(['/reports/batches/add-batches']);

        // const dialogRef = this.dialog.open(BatchAddEditComponent, {
        //     width: '100%',
        //     data: { action: 'create' },
        // });
        // dialogRef.afterClosed().subscribe((data) => {
        //     if (data) {
        //         // this.getFTPList()
        //     }
        // });
    }

    editBatch(element: any) {
        this._router.navigate([
            `/reports/batches/edit-batches/${element.BatchId}`,
        ]);

        // const dialogRef = this.dialog.open(BatchAddEditComponent, {
        //     width: '100%',
        //     data: { action: 'edit', data: element },
        // });
        // dialogRef.afterClosed().subscribe((data) => {
        //     if (data) {
        //         // this.getFTPList()
        //     }
        // });
    }
    applyFilters() {
        const page = this.paginator?.pageIndex + 1 || 1; // Pagination indexes are zero-based, so add 1
        const pageSize = this.paginator?.pageSize || 20;
        let filter = {
            batcheName: this.filterForm.value.name || '',
            FromDate:
                (this.filterForm.value.fromDate &&
                    moment(this.filterForm.value.fromDate).format(
                        'YYYY-MM-DD'
                    )) ||
                moment(new Date()).format('YYYY-MM-DD'),
            ToDate:
                (this.filterForm.value.toDate &&
                    moment(this.filterForm.value.toDate).format(
                        'YYYY-MM-DD'
                    )) ||
                moment(new Date()).format('YYYY-MM-DD'),
            page: page,
            pageSize: pageSize,
            status: this.filterForm.value?.status || '',
        };

        console.log(filter, 'filter');

        const filters = this.filterForm.value;
        if ((filters?.name || filters?.status) && this.apiData?.length > 0) {
            // console.log(this.apiData[0]?.JobFiles)
            let newArr = [];
            newArr = this.apiData?.filter((item: any) => {
                let nameCondition =
                    !filters?.name ||
                    item?.Name?.toLowerCase().includes(
                        this.filterForm.value?.name?.toLowerCase()
                    );
                let statusCondition =
                    !filters?.status || item.time === filters?.status;

                return nameCondition && statusCondition;
            });
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

    async getBatchList() {
        // let filter = { name: this.filteredData?.name || '', status: this.filteredData?.status || 'active' }
        this.batchesService.storeData = null;
        this.batchesService.jobDetailsData = null;
        this._spinner.show();
        this.batchesService
            .getBatchData()
            .then(async (response) => {
                if (response && response.length > 0) {
                    this.paginator.pageSize = 500;
                    this.paginator.pageIndex = 0;
                    this.apiData = response;
                    this.mainData = response;
                    this.dataSource.data = this.apiData.slice(0, 500);
                    // this.paginator = response[0].JobFiles.length;
                    this.totalItemCount =
                        (response.length > 0 && response.length) || 500;
                }
                setTimeout(() => {
                    this._spinner.hide();
                }, 500);
            })
            .catch((e) => {
                this._spinner.hide();
                //   console.log(e.error.message, 'error')
            });
    }

    viewAccount(data: any) {
        this.batchesService.storeData = data;
        this._router.navigate(['/reports/jobs']);
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
}
