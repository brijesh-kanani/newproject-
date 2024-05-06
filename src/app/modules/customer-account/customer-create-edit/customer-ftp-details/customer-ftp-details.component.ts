import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
import { CustomerAccountService } from '../../customer-account.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { SharedService } from 'app/mock-api/common/shared.service';
import { SnackBar } from 'app/layout/common/snack-bar/snack-bar.class';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CustomerFtpEditComponent } from './customer-ftp-edit/customer-ftp-edit.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { ImportService } from '../customer-mapping/import.service';
import { ReceivingService } from '../receiving-mapping/receiving.service';

@Component({
    selector: 'app-customer-ftp-details',
    templateUrl: './customer-ftp-details.component.html',
    styleUrls: ['./customer-ftp-details.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatTableModule,
        MatIconModule,
        MatSnackBarModule,
        MatDialogModule,
        MatTooltipModule,
        MatMenuModule,
    ],
})
export class CustomerFtpDetailsComponent {
    ftpData: any;
    dataSource = new MatTableDataSource();
    displayedColumns: string[] = [
        'name',
        'ftpUser',
        'ftpHost',
        'ftpPassword',
        'ftpPort',
        'isActive',
        'action',
    ];
    snackBar: SnackBar;
    hidePassword: boolean[] = [];
    star: string = '*';

    constructor(
        private customerService: CustomerAccountService,
        private spinner: NgxSpinnerService,
        private sharedService: SharedService,
        private snack: MatSnackBar,
        private dialog: MatDialog,
        private importService: ImportService,
        private receivingService: ReceivingService
    ) {
        this.snackBar = new SnackBar(snack);
    }

    ngOnInit() {
        this.getFTPList();
    }

    getFTPList() {
        this.spinner.show();
        if (
            this.customerService.editCrateUser &&
            this.customerService.editCrateUser.user
        ) {
            let accountNumber =
                this.customerService.editCrateUser.user.AccountNumber;
            this.customerService
                .getFTPDetails(accountNumber)
                .then((response) => {
                    if (response) {
                        this.dataSource.data = response;
                        this.importService.ftpAccountListData = response;
                        this.customerService.ftpAccountListData.next(response);
                        this.hidePassword = Array(response.length).fill(true);
                        this.spinner.hide();
                    }
                })
                .catch((e) => {
                    this.spinner.hide();
                    console.log(e.error.message, 'errror');
                });
        }
    }

    async deleteFTP(row: any) {
        const yes = await this.sharedService.ask(
            'Are you sure you want to delete this FTP?'
        );

        if (!yes) {
            return;
        }
        this.customerService
            .deleteFTP(row)
            .then((response) => {
                if (response) {
                    this.getFTPList();
                    this.snackBar.success(response.message);
                }
            })
            .catch((error) => {
                this.getFTPList();
                this.snackBar.error(error.message);
            });
    }

    async activeInactiveFTP(row: any) {
        const yes = await this.sharedService.ask(
            `Are you sure you want to ${
                row.isActive ? 'deactive' : 'active'
            } this FTP?`
        );
        if (!yes) {
            return;
        }
        if (row && row.AccountId) {
            let body: any = {
                id: row.AccountId,
                isActive: !row.isActive,
            };
            this.customerService
                .activeInactiveFTP(body)
                .then((response) => {
                    if (response) {
                        this.getFTPList();
                        this.snackBar.success(response.message);
                    }
                })
                .catch((error) => {
                    this.getFTPList();
                    this.snackBar.error(error.message);
                });
        } else {
            this.snackBar.error('FTP id not found');
        }
    }

    createFTP() {
        const dialogRef = this.dialog.open(CustomerFtpEditComponent, {
            width: '100%',
            data: { action: 'create' },
        });
        dialogRef.afterClosed().subscribe((data) => {
            if (data) {
                this.getFTPList();
            }
        });
    }

    editFTP(data: any) {
        const dialogRef = this.dialog.open(CustomerFtpEditComponent, {
            width: '100%',
            data: { action: 'edit', data: data },
        });
        dialogRef.afterClosed().subscribe((data) => {
            if (data) {
                this.getFTPList();
            }
        });
    }

    passwordShow(index: number): void {
        this.hidePassword[index] = !this.hidePassword[index];
    }
}
