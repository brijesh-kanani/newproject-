import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TemplatesService } from '../templates.service';
import { SnackBar } from 'app/layout/common/snack-bar/snack-bar.class';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
    selector: 'app-templates-add-edit',
    templateUrl: './templates-add-edit.component.html',
    styleUrls: ['./templates-add-edit.component.scss'],
    imports: [
        MatDialogModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatCheckboxModule,
        MatSnackBarModule,
    ],
    standalone: true,
})
export class TemplatesAddEditComponent {
    templateForm: FormGroup;
    isEdit: boolean = false;
    snackBar: SnackBar;
    searchFormatType: any;

    filterFormat: any;
    filterReport: any;

    Reports = [
        { value: 'first', name: 'First' },
        { value: 'second', name: 'Second' },
        { value: 'third', name: 'Third' },
        { value: 'forth', name: 'Forth' },
        { value: 'five', name: 'Five' },
    ];
    Formats = [
        { value: 'first', name: 'First' },
        { value: 'second', name: 'Second' },
        { value: 'third', name: 'Third' },
        { value: 'forth', name: 'Forth' },
        { value: 'five', name: 'Five' },
    ];
    constructor(
        public dialogRef: MatDialogRef<TemplatesAddEditComponent>,
        private templatesService: TemplatesService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public matsnackBar: MatSnackBar
    ) {
        this.snackBar = new SnackBar(matsnackBar);
    }

    ngOnInit(): void {
        this.filterFormat = this.Formats;
        this.filterReport = this.Reports;

        if (this.data.action == 'edit') {
            this.isEdit = true;
        }
        this.formInitialize();
    }

    formInitialize() {
        this.templateForm = new FormGroup({
            templateName: new FormControl(this.data?.template?.templateName, [
                Validators.required,
            ]),
            description: new FormControl(this.data?.template?.description, [
                Validators.required,
            ]),
            reportName: new FormControl(this.data?.template?.reportName, [
                Validators.required,
            ]),
            formatType: new FormControl(this.data?.template?.formatType, [
                Validators.required,
            ]),
            isActive: new FormControl(this.data?.template?.isActive),
            reportFilterValue: new FormControl(''),
            formatFilterValue: new FormControl(''),
        });
    }

    handleSubmit() {
        console.log('sdfsfsdf', this.templateForm);
        if (this.templateForm.status === 'VALID') {
            this.templateForm.patchValue({
                description: this.templateForm.get('description').value.trim(),
                templateName: this.templateForm
                    .get('templateName')
                    .value.trim(),
            });

            if (this.isEdit) {
                this.templatesService
                    .editTemplate(this.data, this.templateForm.value)
                    .then((res) => {
                        if (res === 'success') {
                            this.snackBar.success(
                                'Template updated successfully'
                            );
                        }
                    })
                    .catch((err) => {
                        this.snackBar.error('Error While Updating Template');
                        console.log(err, 'Error');
                    });
            } else {
                this.templatesService
                    .addTemplate(this.templateForm.value)
                    .then((res) => {
                        if (res === 'success') {
                            this.snackBar.success(
                                'Template created successfully'
                            );
                        }
                    })
                    .catch((err) => {
                        this.snackBar.error('Error While Creating Template');
                        console.log(err, 'Error');
                    });
            }
            this.dialogRef.close();
        }
    }

    resetFilter() {
        this.filterFormat = this.Formats;
        this.filterReport = this.Reports;
        this.templateForm.patchValue({
            reportFilterValue: '',
            formatFilterValue: '',
        });
    }
    changeSearch(type: any) {
        if (type === 'Format') {
            this.filterFormat = this.Formats;

            if (this.templateForm.value.formatFilterValue !== '') {
                this.filterFormat = this.filterFormat.filter((format: any) =>
                    format.name
                        .toLowerCase()
                        .includes(
                            this.templateForm.value.formatFilterValue.toLowerCase()
                        )
                );
            }
        } else if (type === 'Report') {
            this.filterReport = this.Reports;

            if (this.templateForm.value.reportFilterValue !== '') {
                this.filterReport = this.filterReport.filter((report: any) =>
                    report.name
                        .toLowerCase()
                        .includes(
                            this.templateForm.value.reportFilterValue.toLowerCase()
                        )
                );
            }
        }
    }

    ngOnDestroy(): void {
        this.isEdit = false;
    }
}
