import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AngularCommonModule } from 'app/mock-api/common/angular-common.modules';
import { format } from 'highcharts';

@Component({
    selector: 'app-job-edit-dialog',
    templateUrl: './job-edit-dialog.component.html',
    styleUrls: ['./job-edit-dialog.component.scss'],
    standalone: true,
    imports: [AngularCommonModule],
})
export class JobEditDialogComponent {
    reportForm: FormGroup;

    formatType: any[] = [
        { name: 'PDF', value: 'pdf' },
        { name: 'XLS', value: 'xls' },
        { name: 'CSV', value: 'csv' },
    ];
    constructor(
        public dialogRef: MatDialogRef<JobEditDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private formBuilder: FormBuilder
    ) {}

    ngOnInit(): void {
        console.log(this.data);

        this.buildForm();
    }
    buildForm() {
        this.reportForm = this.formBuilder.group({
            filename: [this.data?.data?.filename],
            format: [this.data?.data?.format],
            interval: [this.data?.data?.interval],
            reportName: [this.data?.data?.reportName],
        });
    }

    close(action: any) {
        if (action === 'close' && this.data.action === 'edit') {
            this.dialogRef.close(this.data.data);
        } else {
            console.log(this.reportForm.value, 'value');

            this.dialogRef.close(this.reportForm.value);
        }
    }
}
