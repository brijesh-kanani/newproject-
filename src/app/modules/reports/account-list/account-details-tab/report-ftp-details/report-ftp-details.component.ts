import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SnackBar } from 'app/layout/common/snack-bar/snack-bar.class';
import { AngularCommonModule } from 'app/mock-api/common/angular-common.modules';
import { AccountsService } from '../../accounts.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from 'app/mock-api/common/shared.service';
import { CreateFtpDialogComponent } from '../create-ftp-dialog/create-ftp-dialog.component';

@Component({
  selector: 'app-report-ftp-details',
  templateUrl: './report-ftp-details.component.html',
  styleUrls: ['./report-ftp-details.component.scss'],
  standalone: true,
  imports: [AngularCommonModule]
})
export class ReportFtpDetailsComponent {
  ftpData: any
  dataSource = new MatTableDataSource;
  displayedColumns: string[] = ['name', 'ftpUser', 'ftpHost', 'ftpPassword', 'ftpPort', 'isActive', 'action'];
  snackBar: SnackBar;
  hidePassword: boolean[] = [];
  star: string = '*';

  constructor(private accountService: AccountsService, private spinner: NgxSpinnerService, private sharedService: SharedService, private snack: MatSnackBar, private dialog: MatDialog) {
    this.snackBar = new SnackBar(snack)
  }

  ngOnInit() {
    this.getFTPList()
  }


  getFTPList() {
    // this.spinner.show()
    // if (this.customerService.editCrateUser && this.customerService.editCrateUser.user) {
    //   let accountNumber = this.customerService.editCrateUser.user.AccountNumber;
    //   this.customerService.getFTPDetails(accountNumber).then((response) => {
    //     if (response) {
    //       this.dataSource.data = response
    //       this.importService.ftpAccountListData = response
    //       this.customerService.ftpAccountListData.next(response);
    //       this.hidePassword = Array(response.length).fill(true);
    //       this.spinner.hide()
    //     }
    //   }).catch((e) => {
    //     this.spinner.hide()
    //     console.log(e.error.message, 'errror')
    //   })
    // }
  }

  async deleteFTP(row: any) {
    const yes = await this.sharedService.ask('Are you sure you want to delete this FTP?')

    if (!yes) {
      return;
    }
    // this.customerService.deleteFTP(row).then((response) => {
    //   if (response) {
    //     this.getFTPList()
    //     this.snackBar.success(response.message)
    //   }
    // }).catch((error) => {
    //   this.getFTPList()
    //   this.snackBar.error(error.message)
    // })
  }

  async activeInactiveFTP(row: any) {
    const yes = await this.sharedService.ask(`Are you sure you want to ${row.isActive ? 'deactive' : 'active'} this FTP?`)
    if (!yes) {
      return;
    }
    if (row && row.AccountId) {
      let body: any = {
        "id": row.AccountId,
        "isActive": !row.isActive
      }
      //   this.customerService.activeInactiveFTP(body).then((response) => {
      //     if (response) {
      //       this.getFTPList()
      //       this.snackBar.success(response.message)
      //     }
      //   }).catch((error) => {
      //     this.getFTPList()
      //     this.snackBar.error(error.message)
      //   })
      // } else {
      //   this.snackBar.error('FTP id not found')
    }
  }

  createFTP() {
    const dialogRef = this.dialog.open(CreateFtpDialogComponent, {
      width: '100%',
      data: { action: 'create' }
    })
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.getFTPList()
      }
    })
  }

  editFTP(data: any) {
    // const dialogRef = this.dialog.open(CustomerFtpEditComponent, {
    //   width: '100%',
    //   data: { action: 'edit', data: data }
    // })
    // dialogRef.afterClosed().subscribe((data) => {
    //   if (data) {
    //     this.getFTPList()
    //   }
    // })
  }

  passwordShow(index: number): void {
    this.hidePassword[index] = !this.hidePassword[index];
  }
}
