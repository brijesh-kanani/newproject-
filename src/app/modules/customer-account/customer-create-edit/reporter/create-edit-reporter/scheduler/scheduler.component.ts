import { Component } from '@angular/core';
import { AngularCommonModule } from 'app/mock-api/common/angular-common.modules';
import { FrequencyShowComponent } from "./frequency-show/frequency-show.component";
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';

@Component({
    selector: 'app-scheduler',
    templateUrl: './scheduler.component.html',
    styleUrls: ['./scheduler.component.scss'],
    standalone: true,
    imports: [AngularCommonModule, FrequencyShowComponent]
})
export class SchedulerComponent {
    cronType = [
        { val: 'Minutely', title: 'Minutes' },
        { val: 'Daily', title: 'Daily' },
        { val: 'Monthly', title: 'Monthly' },
        { val: 'Yearly', title: 'Yearly' },
    ];
    selectedCronType: any;
    schedule: FormGroup;

    constructor(private formBuilder: FormBuilder,){}

    getCronExpression() {
        return this.schedule.get('cronExpression').value;
    }

    changeFrequencyType(event: any) {
        this.selectedCronType = event;
    }

    generatedExpression(event: any) {
        this.schedule.get('cronExpression').setValue(event);
    }

    ngOnInit() {
        this.selectedCronType = 'Minutely';
        this.createForm();
    }

    createForm() {
        this.schedule = this.formBuilder.group({
            // name: [this.data?.data?.Name, Validators.required],
            cronExpression: [],
            // time: [this.data?.data?.BatchTimeName, Validators.required],
            // date: [this.data?.data?.date, Validators.required],
            // day: [this.data?.data?.time, Validators.required],
            // week: [this.data?.data?.week, Validators.required],
            // month: [this.data?.data?.month, Validators.required],
        });
        // if (this.schedule.value.time) {
        //     this.updateFormControlsBasedOnTime(this.data?.data?.BatchTimeName);
        // }
    }
    getCronType(event: MatSelectChange) {
        this.selectedCronType = event.value;
    }
}
