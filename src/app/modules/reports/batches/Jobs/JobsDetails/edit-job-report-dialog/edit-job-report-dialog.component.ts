import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SnackBar } from 'app/layout/common/snack-bar/snack-bar.class';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-edit-job-report-dialog',
    templateUrl: './edit-job-report-dialog.component.html',
    styleUrls: ['./edit-job-report-dialog.component.scss'],
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
        MatSnackBarModule,
    ],
})
export class EditJobReportDialogComponent {
    jobEditForm: FormGroup;
    snackBar: SnackBar;
    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<EditJobReportDialogComponent>,
        private formBuilder: FormBuilder,
        private spinner: NgxSpinnerService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private snack: MatSnackBar
    ) {
        this.snackBar = new SnackBar(snack);
    }

    ngOnInit() {
        this.createForm();
    }

    createForm() {
        this.jobEditForm = this.formBuilder.group({
            FileName: [this.data?.data?.FileName, Validators.required],
            ReportId: [this.data?.data?.ReportId, Validators.required],
            TemplateId: [this.data?.data?.TemplateId, Validators.required],
        });
    }

    saveJobEditForm() {
        console.log(this.jobEditForm.value, 'job report form');
    }
}
