import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SnackBar } from 'app/layout/common/snack-bar/snack-bar.class';
import { AngularCommonModule } from 'app/mock-api/common/angular-common.modules';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-create-email-dialog',
  templateUrl: './create-email-dialog.component.html',
  styleUrls: ['./create-email-dialog.component.scss'],
  standalone: true,
  imports: [AngularCommonModule]
})
export class CreateEmailDialogComponent {
  emailForm: FormGroup;
  ftpData: any;
  accountTypeList: any = [
    {
      name: "FTP", value: 'ftp'
    },
    {
      name: "SFTP", value: 'sftp'
    }
  ];
  warehouseList: any = []
  snackBar: SnackBar

  constructor(private router: Router, public dialogRef: MatDialogRef<CreateEmailDialogComponent>, private formBuilder: FormBuilder, private spinner: NgxSpinnerService, @Inject(MAT_DIALOG_DATA) public data: any, private snack: MatSnackBar) {

    this.snackBar = new SnackBar(snack)
  }

  ngOnInit() {
    this.createForm()
    if (this.data && this.data.action == 'create') {
      this.emailForm.patchValue({ isActive: true })
    } else if (this.data && this.data.action == 'edit') {
      this.emailForm.get('warehouse').disable()
    }
    this.getWarehouseByUser()
  }

  createForm() {
    this.emailForm = this.formBuilder.group({
      username: [this.data?.data?.ftpUser, Validators.required],
      title: [this.data?.data?.accountType, Validators.required],
      email: [this.data?.data?.isActive, Validators.required],
      subject: [this.data?.data?.WarehouseId, Validators.required],
    });
  }


  getWarehouseByUser() {
    // let data = JSON.parse(localStorage.getItem('user'))
    // if (data && data.IdUser) {
    //   this.customerService.getWarehouseByUser(data).then((res) => {
    //     if (res) {
    //       this.warehouseList = res
    //       if (this.data && this.data.action == 'create' && res.length == 1) {
    //         this.emailForm.patchValue({ warehouse: res[0].Id })
    //       } else {
    //         this.emailForm.get('warehouse')?.disable()
    //       }
    //     }
    //   }).catch((error) => {
    //     console.log(error, 'get warehouse error')
    //     this.snackBar.error(error.errorMessage)
    //   })
    // } else {
    //   this.router.navigate(['/sign-in'])
    //   this.snackBar.error('UserId not found')
    // }
    // let data = this.customerService.editCrateUser;

    // if (data) {
    //   this.customerService.getWarehouseByAccountNumber(data).then((res) => {
    //     if (res) {
    //       this.warehouseList = res
    //       // if (this.data && this.data.action == 'create' && res.length == 1) {
    //       //   this.emailForm.patchValue({ warehouse: res[0].Id })
    //       // } else {
    //       //   this.emailForm.get('warehouse')?.disable()
    //       // }
    //     }
    //   }).catch((error) => {
    //     console.log(error, 'get warehouse error')
    //     this.snackBar.error(error.errorMessage)
    //   })
    // }
  }


  saveFtp() {
    console.log(this.emailForm.value, 'this.emailForm')
    // if (this.data && this.data.data && this.data.data.AccountId) {
    //   this.editFtp()
    // } else {
    //   this.createFtp()
    // }
  }

  editFtp() {
    // this.spinner.show()
    let body: any =
    {
      "AccountId": this.data?.data?.AccountId,
      "name": this.emailForm.value?.name,
      "ftpHost": this.emailForm.value?.host,
      "ftpUser": this.emailForm.value?.username,
      "ftpPassword": this.emailForm.value?.password,
      "ftpPort": Number(this.emailForm.value?.port),
      "accountType": this.emailForm.value?.accountType,
      "isActive": this.emailForm.value?.isActive,
      // "accountNumber": this.customerService?.editCrateUser?.user?.AccountNumber,
      "folderName": this.emailForm.value?.orderFolderName,
      "archiveFolder": this.emailForm.value?.orderArchiveFolder,
      "receiptFolderName": this.emailForm.value?.receiptFolderName,
      "receiptArchiveFolder": this.emailForm.value?.receiptArchiveFolder,
      "skuFolderName": this.emailForm.value?.skuFolderName,
      "kitFolderName": this.emailForm.value?.kitFolderName,
      "includes": this.emailForm.value?.fileName,
      "FolderConfigId": this.data.data.FolderConfigId,
      "status": 1
    }

    // this.customerService.editFtp(body).then((response: any) => {
    //   if (response) {
    //     this.snackBar.success(response.message)
    //     this.spinner.hide()
    //     this.dialogRef.close(response)
    //   }
    // }).catch((error: any) => {
    //   this.snackBar.error(error.message)
    //   this.spinner.hide()
    // })
  }

  async createFtp() {
    // this.spinner.show()
    let body: any =
    {
      "name": this.emailForm.value?.name,
      "ftpHost": this.emailForm.value?.host,
      "ftpUser": this.emailForm.value?.username,
      "ftpPassword": this.emailForm.value?.password,
      "ftpPort": Number(this.emailForm.value?.port),
      "accountType": this.emailForm.value?.accountType,
      "isActive": this.emailForm.value?.isActive,
      // "accountNumber": this.customerService?.editCrateUser?.user?.AccountNumber,
      "warehouseId": this.emailForm.value?.warehouse,
      "folderName": this.emailForm.value?.orderFolderName,
      "archiveFolder": this.emailForm.value?.orderArchiveFolder,
      "receiptFolderName": this.emailForm.value?.receiptFolderName,
      "receiptArchiveFolder": this.emailForm.value?.receiptArchiveFolder,
      "skuFolderName": this.emailForm.value?.skuFolderName,
      "kitFolderName": this.emailForm.value?.kitFolderName,
      "fileName": this.emailForm.value?.fileName,
      "status": 1
    }
    // await this.customerService.createFtp(body).then((response: any) => {
    //   if (response) {
    //     this.snackBar.success(response.message)
    //     this.spinner.hide()
    //     this.dialogRef.close(response)
    //   }
    // }).catch((error: any) => {
    //   this.snackBar.error(error.message)
    //   this.spinner.hide()
    // })
  }
}
