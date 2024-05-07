import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { AngularCommonModule } from 'app/mock-api/common/angular-common.modules';
import { valid } from 'chroma-js';
import { ReportFormComponent } from './report-form/report-form.component';
import { MatDialog } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';

@Component({
    selector: 'app-add-reports',
    templateUrl: './add-reports.component.html',
    styleUrls: ['./add-reports.component.scss'],
    standalone: true,
    imports: [AngularCommonModule, MatStepperModule]
})
export class AddReportsComponent {
    @ViewChild('reportInput') reportInput: ElementRef<HTMLInputElement>
    reportsList = [
        { value: 'All Order', name: 'All Order' },
        { value: 'Pending Order', name: 'Pending Order' },
        { value: 'Held Orders', name: 'Held Orders' },
        { value: 'Shipped Order ', name: 'Shipped Order ' },
        { value: 'Processed  Orders', name: 'Processed  Orders' },
        { value: 'Pickup  Orders', name: 'Pickup  Orders' },
        { value: 'Cancelled  Orders', name: 'Cancelled  Orders' },
    ]
    selectedReport: any;

    formatList: any = [
        {
            name: "PDF", value: 'pdf'
        },
        {
            name: "CSV", value: 'csv'
        },
        {
            name: "XlS", value: 'xls'
        }
    ];

    displayedColumns: string[] = [
        'Id',
        'ReportName',
        'Action',
    ];

    reportRows: any[];

    constructor(private dialog: MatDialog,) { }

    ngOnInit(): void {
        this.reportRows = []
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.

    }

    addReports(reportInput: MatChipInputEvent): void {
        console.log('sfdfsd', reportInput.value, this.reportRows.length);

        if (reportInput.value) {
            const newRowId = this.reportRows.length + 1;
            this.reportRows.push({ id: newRowId, value: reportInput.value });
            this.reportRows = [... this.reportRows]
            console.log('dsdsdsd', this.reportRows);

            let emailsField;
            // if (this.editAlert.get('emails').value) {
            //     emailsField = `${this.editAlert.get('emails').value}, ${reportInput.value}`
            // } else {
            //     emailsField = reportInput.value
            // }
            // this.editAlert.get('emails').setValue(emailsField)
            // console.log('sdsds', this.editAlert.get('emails').value)
            reportInput.value = ''
            this.createReport(reportInput.value)
        }
    }

    createReport(id: any) {
        const dialogRef = this.dialog.open(ReportFormComponent, {
            width: '100%',
            data: { action: 'create' }
        })
        dialogRef.afterClosed().subscribe((data) => {
            if (data) {
                //   this.getFTPList()
            }
        })
    }

}
