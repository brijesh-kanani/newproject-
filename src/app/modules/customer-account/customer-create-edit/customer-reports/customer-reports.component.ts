import { Component } from '@angular/core';
import { ReportJobListComponent } from './report-job-list/report-job-list.component';
import { AngularCommonModule } from 'app/mock-api/common/angular-common.modules';
import { CustomerAccountService } from '../../customer-account.service';
import { JobAddStepperComponent } from './job-add-stepper/job-add-stepper.component';

@Component({
    selector: 'app-customer-reports',
    templateUrl: './customer-reports.component.html',
    styleUrls: ['./customer-reports.component.scss'],
    standalone: true,
    imports: [
        ReportJobListComponent,
        AngularCommonModule,
        JobAddStepperComponent,
    ],
})
export class CustomerReportsComponent {
    reportList: boolean = true;
    constructor(private customerService: CustomerAccountService) {}

    ngOnInit(): void {
        this.customerService.reportList.subscribe((res) => {
            this.reportList = res;
        });
    }
    AddReport() {
        this.customerService.reportList.next(false);
    }
}
