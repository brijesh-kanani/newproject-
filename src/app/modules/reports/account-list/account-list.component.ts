import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { SnackBar } from 'app/layout/common/snack-bar/snack-bar.class';
import { CustomerAccountService } from 'app/modules/customer-account/customer-account.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AccountFilterComponent } from './account-filter/account-filter.component';
import { AngularCommonModule } from 'app/mock-api/common/angular-common.modules';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { AccountsService } from './accounts.service';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  standalone: true,
  imports: [AngularCommonModule, AccountFilterComponent],
})
export class AccountListComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource = new MatTableDataSource();
  viewMappingData: any = []
  displayedColumns: string[] = ['AccountName', 'IsActive', 'action'];
  customerList: any = [];
  filteredData: any = [];
  totalItemCount: number;
  snackBar: SnackBar
  users: any = [
  ];
  constructor(private snack: MatSnackBar, private dialog: MatDialog, private _router: Router, private _spinner: NgxSpinnerService, private customerAccountService: CustomerAccountService, private accountService: AccountsService) {
    this.snackBar = new SnackBar(snack)
  }


  ngOnInit() {
    setTimeout(() => {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.paginator.pageSize = 20
      this.getAccountList();
    }, 100)

  }


  getAccountList() {
    let filter = { name: this.filteredData?.name || '', status: this.filteredData?.status || 'active' }
    this._spinner.show()
    this.customerAccountService.getAccountList(filter).then((response) => {
      if (response && response.account.length > 0) {
        this.paginator.pageSize = 20;
        this.paginator.pageIndex = 0;
        this.dataSource.data = response.account;
        this.dataSource.paginator.length = response.account.length;
        this._spinner.hide()
      } else {
        this.snackBar.error('No data found')
        this.paginator.pageSize = 20;
        this.paginator.pageIndex = 0;
        this.dataSource.data = response.account;
        this.dataSource.paginator.length = response.account.length;
        this._spinner.hide()
      }
    }).catch((e) => {
      this._spinner.hide()
      console.log(e.error.message, 'error')
    })
  }


  viewAccount(user: any) {
    this.accountService.reportAccountsDetails = { action: 'edit', user }
    this._router.navigate(['reports/account-details'])

  }


  applyCustomerFilters(filters: any) {
    this.filteredData = filters
    if (this.paginator) {
      this.paginator.pageSize = 20;
      this.paginator.pageIndex = 0;
    }
    this.getAccountList()
  }

  // viewFileLog(data: any) {
  //   // this.fileLogService.filters.account = data.AccountNumber;
  //   this._router.navigate(['/file-logs'])
  // }

}


