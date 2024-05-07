import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { AngularCommonModule } from 'app/mock-api/common/angular-common.modules';

@Component({
    selector: 'app-job-configurations',
    templateUrl: './job-configurations.component.html',
    styleUrls: ['./job-configurations.component.scss'],
    standalone: true,
    imports: [AngularCommonModule,MatStepperModule]
})
export class JobConfigurationsComponent {
    jobForm: FormGroup;
    searchAccount = new FormControl('')
    JobTypeList: any = [
        {
            name: "Ftp", value: 'Ftp'
        },
        {
            name: "Email", value: 'Email'
        }
    ];
    ftpList: any = [
        {
            name: "FTP 1", value: 'ftp1'
        },
        {
            name: "FTP 2", value: 'ftp2'
        }
    ];
    emailList: any = [
        {
            name: "abc@gmail.com", value: 'abc@gmail.com'
        },
        {
            name: "xyz@gmail.com", value: 'xyz@gmail.com'
        }
    ];
    reportList: any = [
        {
            name: "Report 1", value: 'Report 1'
        },
        {
            name: "Report 2", value: 'Report 2'
        }
    ];
    formatList: any = [
        {
            name: "PDF", value: 'pdf'
        },
        {
            name: "CSV", value: 'csv'
        }
    ];
    filterAccountList: any;

    constructor(private fb: FormBuilder) { }

    ngOnInit(): void {
        this.jobForm = this.fb.group({
            fileName: [, Validators.required],
            customerName: [, Validators.required],
            jobType: [, Validators.required],
            email: [, Validators.required],
            emailTitle: [, Validators.required],
            emailSubject: [, Validators.required],
            format: [, Validators.required],
            report: [, Validators.required],
            ftp: [, Validators.required],
            account: [, Validators.required],
        });
    }
    onKeydown(e: KeyboardEvent, i: HTMLInputElement) {
        i.onkeydown?.(e);
        e.stopPropagation();
    }
}
