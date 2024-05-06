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

interface EmailItem {
    id: number;
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

    emailForm: FormGroup;
    emailControl: FormControl;
    newEmail: string = '';
    editRowId: number = -1;

    emailsList: EmailItem[] = [
        { id: 1, email: 'brijesh1@gmail.com' },
        { id: 2, email: 'shivam1@gmail.com' },
    ];
    editedEmail: any;

    constructor(private fb: FormBuilder, public matsnackBar: MatSnackBar) {
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
        this.dataSource.data = this.emailsList;
    }

    // addEmail(): void {
    //     if (this.emailForm.invalid) {
    //         return;
    //     }

    //     if (this.emailForm.value) {
    //         this.newEmail = this.emailForm.value.email.trim();
    //     }

    //     if (this.newEmail) {
    //         const newId = this.emailsList.length + 1;
    //         this.emailsList.push({ id: newId, email: this.newEmail });
    //         this.dataSource.data = this.emailsList;
    //         this.emailForm.reset();
    //         this.snackbar.success('Email created successfully.');
    //     }
    // }
    addEmail(): void {
        if (this.emailForm.invalid) {
            return;
        }

        this.newEmail = this.emailForm.value.email.trim();

        const emailExists = this.emailsList.some(
            (item) => item.email.toLowerCase() === this.newEmail.toLowerCase()
        );

        if (emailExists) {
            this.snackbar.error(
                'Email already exists. Please use a different email.'
            );
        } else {
            const newId = this.emailsList.length + 1;
            this.emailsList.push({ id: newId, email: this.newEmail });
            this.dataSource.data = this.emailsList;
            this.emailForm.reset();
            this.snackbar.success('Email created successfully.');
        }
    }

    editRow(rowId: number): void {
        this.editRowId = rowId;
        const emailToEdit = this.emailsList.find(
            (item) => item.id === rowId
        )?.email;
        this.emailControl.patchValue(emailToEdit);
    }

    saveEditedEmail(id: number): void {
        this.editedEmail = this.emailControl.value;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (this.editedEmail && emailRegex.test(this.editedEmail)) {
            const emailExists = this.emailsList.some(
                (item) =>
                    item.email.toLowerCase() ===
                        this.editedEmail.toLowerCase() && item.id !== id
            );
            if (!emailExists) {
                const index = this.emailsList.findIndex(
                    (item) => item.id === id
                );
                if (index !== -1) {
                    this.emailsList[index].email = this.editedEmail;
                    this.cancelEdit();
                    this.snackbar.success('Email updated successfully.');
                }
            } else {
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
        const index = this.emailsList.findIndex((item) => item.id === rowId);
        if (index !== -1) {
            this.emailsList.splice(index, 1);
            this.dataSource.data = this.emailsList;
            this.snackbar.success('Email deleted successfully.');
        }
    }

    // Method to generate a random color
    getRandomColor(): string {
        // Generate a random hex color code
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    }

    // Method to apply random background color to each row
    getRowBackgroundColor(row: any): any {
        return {
            'background-color': this.getRandomColor(),
        };
    }
}
