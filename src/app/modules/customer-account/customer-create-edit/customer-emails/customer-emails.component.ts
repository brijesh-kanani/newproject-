import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { SnackBar } from 'app/layout/common/snack-bar/snack-bar.class';
import { NgxSpinnerService } from 'ngx-spinner';
import { AngularCommonModule } from 'app/mock-api/common/angular-common.modules';
import { CustomerAccountService } from '../../customer-account.service';
import { map } from 'lodash';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

interface EmailItem {
    id: number;
    accountNumber: number;
    email: string;
}
@Component({
    selector: 'app-customer-emails',
    templateUrl: './customer-emails.component.html',
    styleUrls: ['./customer-emails.component.scss'],
    standalone: true,
    imports: [
        MatButtonModule,
        NgIf,
        NgFor,
        CommonModule,
        MatIconModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatSnackBarModule,
        MatFormFieldModule,
        FormsModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatTooltipModule,
        AngularCommonModule,
    ],
})
export class CustomerEmailsComponent {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    displayedColumns: any = ['id', 'email', 'actions'];
    snackbar: SnackBar;
    dataSource = new MatTableDataSource();
    //api binding--------------
    accountNumber: number;
    emailsListOfAccount: EmailItem[];
    emailToAdd: object;
    emailToEdit: object;
    //-------------------------

    emailForm: FormGroup;
    emailControl: FormControl;
    newEmail: string = '';
    editRowId: number = -1;
    editedEmail: any;
    // emailExists: boolean;
    emailAlreadyExistsInList: boolean = false;

    constructor(
        private fb: FormBuilder,
        public matsnackBar: MatSnackBar,
        private _spinner: NgxSpinnerService,
        private customerAccountService: CustomerAccountService
    ) {
        this.emailForm = fb.group({
            email: [
                '',
                [
                    Validators.pattern(
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
                    ),
                ],
            ],
        });

        this.emailControl = new FormControl('', [
            Validators.pattern(
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            ),
        ]);
        this.snackbar = new SnackBar(matsnackBar);
    }

    ngOnInit(): void {
        if (
            this.customerAccountService.editCrateUser &&
            this.customerAccountService.editCrateUser.user
        ) {
            this.accountNumber =
                this.customerAccountService.editCrateUser.user.AccountNumber;
        }

        this.getEmailListByAccount();
    }

    addEmail(): void {
        if (this.emailForm.invalid) {
            return;
        }

        this.newEmail = this.emailForm.value.email.trim();
        console.log('email to add in api is:', this.newEmail);
        let emailExists;
        if (this.emailsListOfAccount.length > 0) {
            emailExists = this.emailsListOfAccount.some(
                (item) =>
                    item.email.toLowerCase() === this.newEmail.toLowerCase()
            );
        }

        if (emailExists) {
            this.snackbar.error(
                'Email already exists. Please use a different email.'
            );
            // this.emailAlreadyExistsInList = true;
        } else {
            // this.emailAlreadyExistsInList = false;

            this._spinner.show();
            this.emailToAdd = {
                id: 0,
                accountNumber: this.accountNumber,
                email: this.newEmail,
            };

            this.customerAccountService
                .createEditEmailForAccount(this.emailToAdd)
                .then((response) => {
                    this.emailForm.reset();
                    this.snackbar.success('Email created successfully.');
                    this.getEmailListByAccount();
                    this._spinner.hide();
                })
                .catch((e) => {
                    this._spinner.hide();
                    // console.log(e.error.message, 'error');
                });
        }
    }

    editRow(rowId: number): void {
        this.editRowId = rowId;
        const emailToEdit = this.emailsListOfAccount.find(
            (item) => item.id === rowId
        )?.email;
        this.emailControl.patchValue(emailToEdit);
    }

    saveEditedEmail(id: number): void {
        console.log(this.dataSource.data);
        this.editedEmail = this.emailControl.value;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (this.editedEmail && emailRegex.test(this.editedEmail)) {
            let emailExists;
            if (this.emailsListOfAccount.length > 0) {
                emailExists = this.emailsListOfAccount.some(
                    (item) =>
                        item.email.toLowerCase() ===
                            this.editedEmail.toLowerCase() && item.id !== id
                );
            }
            if (!emailExists) {
                // this.emailAlreadyExistsInList = false;

                const index = this.emailsListOfAccount.findIndex(
                    (item) => item.id === id
                );
                if (index !== -1) {
                    this.emailToEdit = {
                        id: id,
                        accountNumber: this.accountNumber,
                        email: this.editedEmail,
                    };
                    // console.log(this.emailToEdit, 'Email object');

                    this._spinner.show();
                    this.customerAccountService
                        .createEditEmailForAccount(this.emailToEdit)
                        .then((response) => {
                            this.cancelEdit();
                            this.snackbar.success(
                                'Email updated successfully.'
                            );
                            this.getEmailListByAccount();
                            this._spinner.hide();
                        })
                        .catch((e) => {
                            this._spinner.hide();
                            // console.log(e.error.message, 'error');
                        });
                }
            } else {
                // this.emailAlreadyExistsInList = true;
                this.snackbar.error(
                    'Email already exists. Please use a different email.'
                );
            }
        } else {
            // this.snackbar.error('Invalid email.');
        }
    }
    cancelEdit(): void {
        this.editRowId = -1;
    }

    deleteEmail(rowId: number): void {
        const index = this.emailsListOfAccount.findIndex(
            (item) => item.id === rowId
        );
        if (index !== -1) {
            this._spinner.show();
            this.customerAccountService
                .deleteEmailForAccount(rowId)
                .then((response) => {
                    // console.log(response.message);

                    this.snackbar.success('Email deleted successfully.');
                    this.getEmailListByAccount();
                    this._spinner.hide();
                })
                .catch((e) => {
                    this._spinner.hide();
                    // console.log(e.error.message, 'error');
                });
        }
    }

    getEmailListByAccount() {
        this._spinner.show();
        if (this.accountNumber) {
            this.customerAccountService
                .getEmailsByAccount(this.accountNumber)
                .then((response) => {
                    this.dataSource.data = response.data;
                    this.emailsListOfAccount = response.data;
                    this._spinner.hide();
                })
                .catch((e) => {
                    this._spinner.hide();
                    // console.log(e.error.message, 'error');
                });
        }
    }
    colorMap: { [key: number]: string } = {};
    getRowBackgroundColor(row: any): string {
        if (!this.colorMap[row.id]) {
            const r = Math.floor(Math.random() * 256);
            const g = Math.floor(Math.random() * 256);
            const b = Math.floor(Math.random() * 256);
            this.colorMap[row.id] = `rgb(${r}, ${g}, ${b})`;
        }
        // console.log(this.colorMap[row.id]);
        return this.colorMap[row.id];
    }
}
