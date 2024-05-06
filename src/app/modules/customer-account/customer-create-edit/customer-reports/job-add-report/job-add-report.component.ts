import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AngularCommonModule } from 'app/mock-api/common/angular-common.modules';
import { JobEditDialogComponent } from './job-edit-dialog/job-edit-dialog.component';
import { SharedService } from 'app/mock-api/common/shared.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-job-add-report',
    templateUrl: './job-add-report.component.html',
    styleUrls: ['./job-add-report.component.scss'],
    standalone: true,
    imports: [AngularCommonModule],
})
export class JobAddReportComponent {
    reportList: any[] = [
        { reportName: 'Report 1' },
        { reportName: 'Report 2' },
        { reportName: 'Report 3' },
        { reportName: 'Report 4' },
        { reportName: 'Report 5' },
        { reportName: 'Report 6' },
        { reportName: 'Report 7' },
    ];
    displayedColumns: string[] = ['id', 'reportName', 'actions'];
    dataSource = new MatTableDataSource<any>();
    selectedReports: any[] = [];
    constructor(
        private dialog: MatDialog,
        private sharedServices: SharedService
    ) {}

    ngOnInit(): void {
        this.dataSource.data = this.selectedReports;
    }
    async reportChange(reportData: any) {
        const editData = await this.selectedReports.filter(
            (report) => report.reportName === reportData.reportName
        );

        if (editData[0]) {
            console.log(true);

            this.sharedServices
                .ask('This report is already added .Do you want to edit it?')
                .then((res) => {
                    if (res) {
                        this.editReport(editData[0]);
                    }
                });
        } else {
            const dialogRef = this.dialog.open(JobEditDialogComponent, {
                width: '100%',
                data: { action: 'create', data: reportData },
            });
            dialogRef.afterClosed().subscribe((data) => {
                if (data) {
                    this.selectedReports.push(data);
                    this.dataSource.data = this.selectedReports;
                }
            });
        }
    }

    editReport(data: any) {
        console.log(data, 'aaa');

        const dialogRef = this.dialog.open(JobEditDialogComponent, {
            width: '100%',
            data: {
                action: 'edit',
                data: data,
            },
        });
        dialogRef.afterClosed().subscribe((data) => {
            if (data) {
                console.log(data);
                const index = this.selectedReports.findIndex(
                    (ele) => ele.reportName === data.reportName
                );
                if (index !== -1) {
                    this.selectedReports[index] = data;
                    this.dataSource.data = this.selectedReports;
                } else {
                    console.error('Report not found');
                }
            }
        });
    }

    deleteReport(data: any) {
        console.log(data);

        const index = this.selectedReports.findIndex(
            (ele) => ele.reportName === data.reportName
        );

        this.sharedServices
            .ask('Are you sure you want to delete this report?')
            .then((res) => {
                if (res) {
                    if (index !== -1) {
                        this.selectedReports.splice(index, 1);
                        this.dataSource.data = this.selectedReports;
                    } else {
                        console.error('Report not found');
                        this.dataSource.data = this.selectedReports;
                    }
                }
            })
            .catch((err) => console.log(err));
    }
}
