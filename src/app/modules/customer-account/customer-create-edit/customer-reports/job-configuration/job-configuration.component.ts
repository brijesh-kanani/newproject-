import { Component } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { AngularCommonModule } from 'app/mock-api/common/angular-common.modules';
import { CustomerAccountService } from 'app/modules/customer-account/customer-account.service';
import { BatchesService } from 'app/modules/reports/batches/batches.service';

@Component({
    selector: 'app-job-configuration',
    templateUrl: './job-configuration.component.html',
    styleUrls: ['./job-configuration.component.scss'],
    standalone: true,
    imports: [AngularCommonModule, MatStepperModule],
})
export class JobConfigurationComponent {
    jobForm: FormGroup;
    JobTypeList: any = [
        {
            name: 'Ftp',
            value: 'Ftp',
        },
        {
            name: 'Email',
            value: 'Email',
        },
    ];
    ftpList: any = [
        {
            name: 'FTP 1',
            value: 'ftp1',
        },
        {
            name: 'FTP 2',
            value: 'ftp2',
        },
    ];
    emailList: any = [
        {
            name: 'abc@gmail.com',
            value: 'abc@gmail.com',
        },
        {
            name: 'xyz@gmail.com',
            value: 'xyz@gmail.com',
        },
    ];
    reportList: any = [
        {
            name: 'Report 1',
            value: 'Report 1',
        },
        {
            name: 'Report 2',
            value: 'Report 2',
        },
    ];
    formatList: any = [
        {
            name: 'PDF',
            value: 'pdf',
        },
        {
            name: 'CSV',
            value: 'csv',
        },
    ];

    jobList = [
        { name: 'Ftp', value: 'Ftp' },
        { name: 'Email', value: 'Email' },
        { name: 'All', value: '' },
    ];

    searchAccount = new FormControl('');
    secondFormGroup = this._formBuilder.group({
        secondCtrl: ['', Validators.required],
    });

    isLinear = true;
    disabledFields: boolean = true;
    filterAccountList: any;
    userProfileData: any;

    constructor(
        private _formBuilder: FormBuilder,
        private customerService: CustomerAccountService,
        private batchesService: BatchesService,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        if (
            this.customerService.editCrateUser &&
            this.customerService.editCrateUser.user
        ) {
            this.userProfileData = this.customerService.editCrateUser.user;
        }

        console.log(this.batchesService?.jobDetailsData, 'aaa');

        this.jobForm = this.fb.group({
            fileName: [''],
            customerName: [''],
            jobType: [''],
            email: [''],
            emailTitle: [''],
            emailSubject: [''],
            format: [''],
            ftp: [''],
            account: [this.userProfileData?.AccountName, Validators.required],
        });
    }
    onKeydown(e: KeyboardEvent, i: HTMLInputElement) {
        i.onkeydown?.(e);
        e.stopPropagation();
    }

    goBack() {
        this.customerService.reportList.next(true);
    }
    jobFormSubmitted(form: FormGroup) {
        console.log('###########', form.value);
    }
}
