import { Component, Inject } from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ApexOptions } from 'apexcharts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { FileLogService } from 'app/modules/file-log/file-log.service';

@Component({
    selector: 'app-view-summary-dialog',
    templateUrl: './view-summary-dialog.component.html',
    styleUrls: ['./view-summary-dialog.component.scss'],
    standalone: true,
    imports: [MatDialogModule, MatIconModule, NgApexchartsModule, CommonModule, MatTableModule, MatTooltipModule, MatExpansionModule],
})
export class ViewSummaryDialogComponent {
    displayedColumns: string[] = [
        'status',
        'description',
        'createAt',
    ];
    fileLogDataSource: any = new MatTableDataSource<[]>();
    fileLineLogDataSource: any = new MatTableDataSource<[]>();
    constructor(
        public filelogService: FileLogService,
        public _spinner: NgxSpinnerService,
        public _router: Router,
        public dialogRef: MatDialogRef<ViewSummaryDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    ngOnInit() {
        this.getFileSummary();
    }

    getFileSummary() {
        this._spinner.show()
        this.filelogService.getFileLog(this.data.id).then(
            (response: any) => {
                if (response) {
                    this.fileLogDataSource = JSON.parse(response.statusLog)
                    this.fileLineLogDataSource = JSON.parse(response.statusLog1)
                }
                this._spinner.hide()
            },
            (error) => {
                this._spinner.hide();
                this._router.navigateByUrl('/500-not-found');
                console.error('Error fetching user data:', error);
            }
        );
    }
}
