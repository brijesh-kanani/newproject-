import { CommonModule } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedService } from 'app/mock-api/common/shared.service';
import { SnackBar } from 'app/layout/common/snack-bar/snack-bar.class';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CustomerAccountFilterComponent } from './customer-account-filter/customer-account-filter.component';
import { CustomerAccountService } from './customer-account.service';
import { ViewMappingDialogComponent } from './view-mapping-dialog/view-mapping-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ImportService } from './customer-create-edit/customer-mapping/import.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { FileLogService } from '../file-log/file-log.service';

@Component({
    selector: 'app-customer-account',
    templateUrl: './customer-account.component.html',
    styleUrls: ['./customer-account.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [
        CustomerAccountFilterComponent,
        CommonModule,
        MatIconModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatMenuModule,
        MatSnackBarModule,
        MatTooltipModule,
        MatCheckboxModule,
        MatInputModule,
        FormsModule,
    ],
})
export class CustomerAccountComponent {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    dataSource = new MatTableDataSource();
    viewMappingData: any = [];
    displayedColumns: string[] = ['AccountName', 'IsActive', 'action'];
    customerList: any = [];
    filteredData: any = [];
    totalItemCount: number;
    snackBar: SnackBar;
    users: any = [];
    constructor(
        private snack: MatSnackBar,
        private dialog: MatDialog,
        private _router: Router,
        private _spinner: NgxSpinnerService,
        private sharedService: SharedService,
        private customerAccountService: CustomerAccountService,
        private importService: ImportService,
        private cdr: ChangeDetectorRef,
        private fileLogService: FileLogService
    ) {
        this.snackBar = new SnackBar(snack);
    }

    ngOnInit() {
        setTimeout(() => {
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.paginator.pageSize = 20;
            this.getAccountList();
        }, 100);
    }

    getAccountList() {
        let filter = {
            name: this.filteredData?.name || '',
            status: this.filteredData?.status || 'active',
        };
        this._spinner.show();
        this.customerAccountService
            .getAccountList(filter)
            .then((response) => {
                if (response && response.account.length > 0) {
                    this.paginator.pageSize = 20;
                    this.paginator.pageIndex = 0;
                    this.dataSource.data = response.account;
                    this.dataSource.paginator.length = response.account.length;
                    this._spinner.hide();
                } else {
                    this.snackBar.error('No data found');
                    this.paginator.pageSize = 20;
                    this.paginator.pageIndex = 0;
                    this.dataSource.data = response.account;
                    this.dataSource.paginator.length = response.account.length;
                    this._spinner.hide();
                }
            })
            .catch((e) => {
                this._spinner.hide();
                console.log(e.error.message, 'error');
            });
    }

    // ngAfterViewInit() {
    //   this.paginator.page.subscribe(() => this.getMapping());
    // }

    createMapping() {
        if (this.viewMappingData.mappingAttributes) {
            this.customerAccountService.mappingData = '';
        }
        this.customerAccountService.editCrateUser = { action: 'new' };
        this._router.navigate(['/accounts/details']);
    }

    viewAccount(user: any) {
        this.customerAccountService.editCrateUser = { action: 'edit', user };
        this.customerAccountService.mappingData = this.viewMappingData;
        this.importService.mappingWarehouseData = null;
        this._router.navigate(['/accounts/details']);
    }

    viewMapping(data: any) {
        this.dialog.open(ViewMappingDialogComponent, {
            data: this.viewMappingData.mappingAttributes,
            width: '100%',
        });
    }

    applyCustomerFilters(filters: any) {
        this.filteredData = filters;
        if (this.paginator) {
            this.paginator.pageSize = 20;
            this.paginator.pageIndex = 0;
        }
        this.getAccountList();
    }

    viewFileLog(data: any) {
        this.fileLogService.filters.account = data.AccountNumber;
        this._router.navigate(['/file-logs']);
    }
}
