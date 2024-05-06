import { CommonModule } from '@angular/common';
import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxSpinnerService } from 'ngx-spinner';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SnackBar } from 'app/layout/common/snack-bar/snack-bar.class';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CustomerAccountService } from 'app/modules/customer-account/customer-account.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'jobs-ftp-edit',
  templateUrl: './jobs-ftp-edit.component.html',
  styleUrls: ['./jobs-ftp-edit.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatTableModule, MatPaginatorModule, MatSortModule,
  ],
})
export class JobsFtpEditComponent {
  ftpForm: FormGroup;
  Form: FormGroup;
  emailForm: FormGroup;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource = new MatTableDataSource();
  viewMappingData: any = []
  displayedColumns: string[] = ['ReportId', 'TemplateId', 'FileName', 'action'];
  ftpData: any;
  accountTypeList: any = [
    {
      name: "ftp", value: 'ftp'
    },
    {
      name: "sftp", value: 'sftp'
    }
  ];
  JobTypeList: any = [
    {
      name: "Ftp", value: 'ftp'
    },
    {
      name: "Email", value: 'email'
    }
  ];
  warehouseList: any = []
  snackBar: SnackBar

  constructor(private router: Router, public dialogRef: MatDialogRef<JobsFtpEditComponent>, private formBuilder: FormBuilder, private customerService: CustomerAccountService, private spinner: NgxSpinnerService, @Inject(MAT_DIALOG_DATA) public data: any, private snack: MatSnackBar) {
    this.snackBar = new SnackBar(snack)
  }

  ngOnInit() {
    this.createForm()
    setTimeout(() => {
        if (this.paginator) {
            this.paginator.pageSize = 500;
            this.paginator.pageIndex = 0;
        }

        this.dataSource.sort = this.sort;
    }, 100)
    if (this.data && this.data.action == 'create') {
    //   this.ftpForm.patchValue({ isActive: true })
    } else if (this.data && this.data.action == 'edit') {
      this.Form.get('jobType').disable()

    //   if(this.data?.data?.Data?.ReportItems.length>0){
    //     this.dataSource.data=this.data?.data?.Data?.ReportItems;
    //   }
    }
    this.getWarehouseByUser()
  }

  createForm() {
    console.log(this.data)
    this.ftpForm = this.formBuilder.group({
      port: [this.data?.data?.ftpPort, [Validators.pattern(/^-?(0|[1-9]\d*)?$/), Validators.maxLength(8), Validators.required]],
      host: [this.data?.data?.Data?.Host, Validators.required],
      username: [this.data?.data?.Data?.Id, Validators.required],
      password: [this.data?.data?.Data?.Password, Validators.required],
      name: [this.data?.data?.Data?.UserName, Validators.required],
      accountType: [this.data?.data?.JobTypeId, Validators.required],
      jobType: [this.data?.data?.JobTypeId, Validators.required],
      isActive: [this.data?.data?.isActive, Validators.required],
    //   warehouse: [this.data?.data?.WarehouseId, Validators.required],
    //   fileName: [this.data?.data?.fileName],
      folderName: [this.data?.data?.Folder ? this.data?.data?.Folder : '/outtest' , Validators.required],
      archiveFolder: [this.data?.data?.archiveFolder ? this.data?.data?.archiveFolder : '/archive/', Validators.required],
    });
    this.Form = this.formBuilder.group({
        accountType: [this.data?.data?.JobTypeId, Validators.required],
      });

    this.emailForm = this.formBuilder.group({
        email: [this.data?.data?.Data?.Subject, Validators.required],
        subject: [this.data?.data?.Data?.Subject, Validators.required],
        title: [this.data?.data?.Data?.title, Validators.required],
      });
  }


  getWarehouseByUser() {
    // let data = JSON.parse(localStorage.getItem('user'))
    // if (data && data.IdUser) {
    //   this.customerService.getWarehouseByUser(data).then((res) => {
    //     if (res) {
    //       this.warehouseList = res
    //       if (this.data && this.data.action == 'create' && res.length == 1) {
    //         this.ftpForm.patchValue({ warehouse: res[0].Id })
    //       } else {
    //         this.ftpForm.get('warehouse')?.disable()
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
    let data = this.customerService.editCrateUser;

    if (data) {
      this.customerService.getWarehouseByAccountNumber(data).then((res) => {
        if (res) {
          this.warehouseList = res
          // if (this.data && this.data.action == 'create' && res.length == 1) {
          //   this.ftpForm.patchValue({ warehouse: res[0].Id })
          // } else {
          //   this.ftpForm.get('warehouse')?.disable()
          // }
        }
      }).catch((error) => {
        console.log(error, 'get warehouse error')
        this.snackBar.error(error.errorMessage)
      })
    }
  }

  setFTPPortbyType(data: any) {
    if (data == 'ftp') {
      this.ftpForm.patchValue({ port: 21 })
    } else {
      this.ftpForm.patchValue({ port: 22 })
    }
  }

  saveFtp() {
    if (this.data && this.data.data && this.data.data.AccountId) {
      this.editFtp()
    } else {
      this.createFtp()
    }
  }

  editFtp() {
    // this.spinner.show()
    let body: any =
    {
      "AccountId": this.data?.data?.AccountId,
      "name": this.ftpForm.value?.name,
      "ftpHost": this.ftpForm.value?.host,
      "ftpUser": this.ftpForm.value?.username,
      "ftpPassword": this.ftpForm.value?.password,
      "ftpPort": Number(this.ftpForm.value?.port),
      "accountType": this.ftpForm.value?.accountType,
      "isActive": this.ftpForm.value?.isActive,
      "accountNumber": this.customerService?.editCrateUser?.user?.AccountNumber,
      "folderName": this.ftpForm.value?.folderName,
      "archiveFolder": this.ftpForm.value?.archiveFolder,
      "includes": this.ftpForm.value?.fileName,
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
    this.spinner.show()
    let body: any =
    {
      "name": this.ftpForm.value?.name,
      "ftpHost": this.ftpForm.value?.host,
      "ftpUser": this.ftpForm.value?.username,
      "ftpPassword": this.ftpForm.value?.password,
      "ftpPort": Number(this.ftpForm.value?.port),
      "accountType": this.ftpForm.value?.accountType,
      "isActive": this.ftpForm.value?.isActive,
      "accountNumber": this.customerService?.editCrateUser?.user?.AccountNumber,
      "warehouseId": this.ftpForm.value?.warehouse,
      "folderName": this.ftpForm.value?.folderName,
      "archiveFolder": this.ftpForm.value?.archiveFolder,
      "fileName": this.ftpForm.value?.fileName,
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
