import { Component, ViewEncapsulation } from '@angular/core';
import {
    Validators,
    FormBuilder,
    FormGroup,
    FormControl,
} from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { fuseAnimations } from '@fuse/animations';
import { CommonModule, NgIf } from '@angular/common';
import { CustomerAccountService } from 'app/modules/customer-account/customer-account.service';
import { AngularCommonModule } from 'app/mock-api/common/angular-common.modules';
import { BatchesService } from 'app/modules/reports/batches/batches.service';
import { JobConfigurationComponent } from '../job-configuration/job-configuration.component';
import { JobAddReportComponent } from '../job-add-report/job-add-report.component';
import { JobSchedulerComponent } from '../job-scheduler/job-scheduler.component';

@Component({
    selector: 'app-job-add-stepper',
    templateUrl: './job-add-stepper.component.html',
    styleUrls: ['./job-add-stepper.component.scss'],
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    imports: [
        NgIf,
        AngularCommonModule,
        MatStepperModule,
        CommonModule,
        JobConfigurationComponent,
        JobAddReportComponent,
        JobSchedulerComponent,
    ],
})
export class JobAddStepperComponent {
    secondFormGroup = this._formBuilder.group({
        secondCtrl: ['', Validators.required],
    });

    isLinear = true;

    constructor(
        private _formBuilder: FormBuilder,
        private customerService: CustomerAccountService
    ) {}

    ngOnInit(): void {}
    onKeydown(e: KeyboardEvent, i: HTMLInputElement) {
        i.onkeydown?.(e);
        e.stopPropagation();
    }

    goBack() {
        this.customerService.reportList.next(true);
    }
}
