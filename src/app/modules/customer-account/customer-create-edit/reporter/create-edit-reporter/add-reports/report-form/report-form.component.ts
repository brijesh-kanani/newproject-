import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AngularCommonModule } from 'app/mock-api/common/angular-common.modules';

@Component({
  selector: 'app-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.scss'],
  imports :[AngularCommonModule],
  standalone: true
})
export class ReportFormComponent {

    constructor(public dialogRef: MatDialogRef<ReportFormComponent>,){}
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
}
