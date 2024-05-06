import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SnackBar } from 'app/layout/common/snack-bar/snack-bar.class';
import { AngularCommonModule } from 'app/mock-api/common/angular-common.modules';
import { AccountsService } from '../../accounts.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedService } from 'app/mock-api/common/shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CreateEmailDialogComponent } from '../create-email-dialog/create-email-dialog.component';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-report-email-details',
  templateUrl: './report-email-details.component.html',
  styleUrls: ['./report-email-details.component.scss'],
  standalone: true,
  imports: [AngularCommonModule]
})
export class ReportEmailDetailsComponent {
  ftpData: any
  dataSource = new MatTableDataSource;
  // displayedColumns: string[] = ['name', 'title', 'emails', 'subject', 'action'];
  displayedColumns: string[] = [
    'Id',
    'Email',
    'Action',
  ];
  snackBar: SnackBar;
  hidePassword: boolean[] = [];
  star: string = '*';
  @ViewChild('emailInput') emailInput: ElementRef<HTMLInputElement>;
  emailRows: any = []

  constructor(private accountService: AccountsService, private spinner: NgxSpinnerService, private sharedService: SharedService, private snack: MatSnackBar, private dialog: MatDialog) {
    this.snackBar = new SnackBar(snack)
  }

  ngOnInit() {
    this.getEmailList()
  }


  getEmailList() {
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

  async deleteEmail(row: any) {
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

  async activeInactiveEmail(row: any) {
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

  createEmail() {
    const dialogRef = this.dialog.open(CreateEmailDialogComponent, {
      width: '100%',
      data: { action: 'create' }
    })
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        // this.getFTPList()
      }
    })
  }

  editEmail(data: any) {
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

  addMoreEmails(emailInput: MatChipInputEvent): void {
    if (emailInput.value) {
      const newRowId = this.emailRows.length + 1;
      this.emailRows.push({ id: newRowId, value: emailInput.value });
      this.emailRows = [... this.emailRows]
      let emailsField;
      // if (this.editAlert.get('emails').value) {
      //   emailsField = `${this.editAlert.get('emails').value}, ${emailInput.value}`
      // } else {
      //   emailsField = emailInput.value
      // }
      // this.editAlert.get('emails').setValue(emailsField)
      // console.log('sdsds', this.editAlert.get('emails').value)
      emailInput.value = ''
    }
  }

  removeMoreEmails(index: number) {
    const removeIndex = this.emailRows.findIndex(row => row.id === index)
    this.emailRows = this.emailRows.filter(row => row.id !== index);
    // if (this.editAlert.get('emails').value) {
    //   const emailArray = this.editAlert.get('emails').value.split(', ');
    //   emailArray.splice(removeIndex, 1)
    //   const updatedEmails = emailArray.join(', ');
    //   this.editAlert.get('emails').setValue(updatedEmails)

    // }

  }

  submit() {

  }
}
