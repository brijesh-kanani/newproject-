import { Component } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { SchedulerComponent } from "./scheduler/scheduler.component";
import { JobConfigurationsComponent } from "./job-configurations/job-configurations.component";
import { AddReportsComponent } from "./add-reports/add-reports.component";
import { ReporterService } from '../reporter.service';

@Component({
    selector: 'app-create-edit-reporter',
    templateUrl: './create-edit-reporter.component.html',
    styleUrls: ['./create-edit-reporter.component.scss'],
    standalone: true,
    imports: [MatStepperModule, SchedulerComponent, JobConfigurationsComponent, AddReportsComponent]
})
export class CreateEditReporterComponent {
    constructor (public reporterService:ReporterService){}
    listPage(){
        this.reporterService.page.next('ListPage');

    }
}
