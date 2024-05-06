import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomerAccountService } from '../../../customer-account.service';
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SnackBar } from 'app/layout/common/snack-bar/snack-bar.class';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
    selector: 'app-customer-ftp-edit',
    templateUrl: './customer-ftp-edit.component.html',
    styleUrls: ['./customer-ftp-edit.component.scss'],
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
    ],
})
export class CustomerFtpEditComponent {
    ftpForm: FormGroup;
    ftpData: any;
    accountTypeList: any = [
        {
            name: 'FTP',
            value: 'ftp',
        },
        {
            name: 'SFTP',
            value: 'sftp',
        },
    ];
    warehouseList: any = [];
    snackBar: SnackBar;

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<CustomerFtpEditComponent>,
        private formBuilder: FormBuilder,
        private customerService: CustomerAccountService,
        private spinner: NgxSpinnerService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private snack: MatSnackBar
    ) {
        this.snackBar = new SnackBar(snack);
    }

    ngOnInit() {
        this.createForm();
        if (this.data && this.data.action == 'create') {
            this.ftpForm.patchValue({ isActive: true });
        } else if (this.data && this.data.action == 'edit') {
            this.ftpForm.get('warehouse').disable();
        }
        this.getWarehouseByUser();
    }

    createForm() {
        this.ftpForm = this.formBuilder.group({
            port: [
                this.data?.data?.ftpPort,
                [
                    Validators.pattern(/^-?(0|[1-9]\d*)?$/),
                    Validators.maxLength(8),
                    Validators.required,
                ],
            ],
            host: [this.data?.data?.ftpHost, Validators.required],
            username: [this.data?.data?.ftpUser, Validators.required],
            password: [this.data?.data?.ftpPassword, Validators.required],
            name: [this.data?.data?.name, Validators.required],
            accountType: [this.data?.data?.accountType, Validators.required],
            isActive: [this.data?.data?.isActive, Validators.required],
            warehouse: [this.data?.data?.WarehouseId, Validators.required],
            fileName: [this.data?.data?.fileName],
            orderFolderName: [
                this.data?.data?.folderName
                    ? this.data?.data?.folderName
                    : 'orders',
                Validators.required,
            ],
            orderArchiveFolder: [
                this.data?.data?.archiveFolder
                    ? this.data?.data?.archiveFolder
                    : '/archive',
                Validators.required,
            ],
            receiptFolderName: [
                this.data?.data?.receiptFolderName
                    ? this.data?.data?.receiptFolderName
                    : 'receipt',
                Validators.required,
            ],
            receiptArchiveFolder: [
                this.data?.data?.receiptArchiveFolder
                    ? this.data?.data?.receiptArchiveFolder
                    : 'receipt/archive',
                Validators.required,
            ],
            skuFolderName: [
                this.data?.data?.skuFolderName
                    ? this.data?.data?.skuFolderName
                    : 'sku',
                Validators.required,
            ],
            kitFolderName: [
                this.data?.data?.kitFolderName
                    ? this.data?.data?.kitFolderName
                    : 'kit',
                Validators.required,
            ],
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
            this.customerService
                .getWarehouseByAccountNumber(data)
                .then((res) => {
                    if (res) {
                        this.warehouseList = res;
                        // if (this.data && this.data.action == 'create' && res.length == 1) {
                        //   this.ftpForm.patchValue({ warehouse: res[0].Id })
                        // } else {
                        //   this.ftpForm.get('warehouse')?.disable()
                        // }
                    }
                })
                .catch((error) => {
                    console.log(error, 'get warehouse error');
                    this.snackBar.error(error.errorMessage);
                });
        }
    }

    setFTPPortbyType(data: any) {
        if (data == 'ftp') {
            this.ftpForm.patchValue({ port: 21 });
        } else {
            this.ftpForm.patchValue({ port: 22 });
        }
    }

    saveFtp() {
        if (this.data && this.data.data && this.data.data.AccountId) {
            this.editFtp();
        } else {
            this.createFtp();
        }
    }

    editFtp() {
        // this.spinner.show()
        let body: any = {
            AccountId: this.data?.data?.AccountId,
            name: this.ftpForm.value?.name,
            ftpHost: this.ftpForm.value?.host,
            ftpUser: this.ftpForm.value?.username,
            ftpPassword: this.ftpForm.value?.password,
            ftpPort: Number(this.ftpForm.value?.port),
            accountType: this.ftpForm.value?.accountType,
            isActive: this.ftpForm.value?.isActive,
            accountNumber:
                this.customerService?.editCrateUser?.user?.AccountNumber,
            folderName: this.ftpForm.value?.orderFolderName,
            archiveFolder: this.ftpForm.value?.orderArchiveFolder,
            receiptFolderName: this.ftpForm.value?.receiptFolderName,
            receiptArchiveFolder: this.ftpForm.value?.receiptArchiveFolder,
            skuFolderName: this.ftpForm.value?.skuFolderName,
            kitFolderName: this.ftpForm.value?.kitFolderName,
            includes: this.ftpForm.value?.fileName,
            FolderConfigId: this.data.data.FolderConfigId,
            status: 1,
        };

        this.customerService
            .editFtp(body)
            .then((response: any) => {
                if (response) {
                    this.snackBar.success(response.message);
                    this.spinner.hide();
                    this.dialogRef.close(response);
                }
            })
            .catch((error: any) => {
                this.snackBar.error(error.message);
                this.spinner.hide();
            });
    }

    async createFtp() {
        this.spinner.show();
        let body: any = {
            name: this.ftpForm.value?.name,
            ftpHost: this.ftpForm.value?.host,
            ftpUser: this.ftpForm.value?.username,
            ftpPassword: this.ftpForm.value?.password,
            ftpPort: Number(this.ftpForm.value?.port),
            accountType: this.ftpForm.value?.accountType,
            isActive: this.ftpForm.value?.isActive,
            accountNumber:
                this.customerService?.editCrateUser?.user?.AccountNumber,
            warehouseId: this.ftpForm.value?.warehouse,
            folderName: this.ftpForm.value?.orderFolderName,
            archiveFolder: this.ftpForm.value?.orderArchiveFolder,
            receiptFolderName: this.ftpForm.value?.receiptFolderName,
            receiptArchiveFolder: this.ftpForm.value?.receiptArchiveFolder,
            skuFolderName: this.ftpForm.value?.skuFolderName,
            kitFolderName: this.ftpForm.value?.kitFolderName,
            fileName: this.ftpForm.value?.fileName,
            status: 1,
        };
        await this.customerService
            .createFtp(body)
            .then((response: any) => {
                if (response) {
                    this.snackBar.success(response.message);
                    this.spinner.hide();
                    this.dialogRef.close(response);
                }
            })
            .catch((error: any) => {
                this.snackBar.error(error.message);
                this.spinner.hide();
            });
    }
}
