import { CommonModule } from '@angular/common';
import { Component, HostListener, Inject } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxSpinnerService } from 'ngx-spinner';
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SnackBar } from 'app/layout/common/snack-bar/snack-bar.class';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerAccountService } from 'app/modules/customer-account/customer-account.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { BatchesService } from '../batches.service';
import moment from 'moment';
import { AngularCommonModule } from 'app/mock-api/common/angular-common.modules';
import { FrequencyShowComponent } from './frequency-show/frequency-show.component';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs';

@Component({
    selector: 'batches-add-edit',
    templateUrl: './batches-add-edit.component.html',
    styleUrls: ['./batches-add-edit.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSnackBarModule,
        MatDatepickerModule,
        MatNativeDateModule,
        AngularCommonModule,
        FrequencyShowComponent,
    ],
})
export class BatchAddEditComponent {
    ftpForm: FormGroup;
    ftpData: any;
    displayedColumns: string[] = [
        'fileNameOnly',
        'customer',
        'AccountName',
        'JobTypeId',
        'action',
    ];
    dataSource = new MatTableDataSource();
    createRoute: boolean;
    // accountTypeList: any = [
    //     {
    //         name: "ftp", value: 'ftp'
    //     },
    //     {
    //         name: "sftp", value: 'sftp'
    //     }
    // ];
    // warehouseList: any = []
    // selectTimeList = [
    //     { name: 'Day', value: 'day',id:'1' },
    //     { name: 'Week', value: 'week',id:'2' },
    //     { name: 'Month', value: 'month',id:'3' },
    // ]
    // daysList = [
    //     { name: '1 AM', value: '1am' },
    //     { name: '2 AM', value: '2am' },
    //     { name: '3 AM', value: '3am' },
    //     { name: '4 AM', value: '4am' },
    //     { name: '4 AM', value: '5am' },
    //     { name: '6 AM', value: '6am' },
    //     { name: '7 AM', value: '7am' },
    //     { name: '8 AM', value: '8am' },
    //     { name: '9 AM', value: '9am' },
    //     { name: '10 AM', value: '10am' },
    //     { name: '11 AM', value: '11am' },
    //     { name: '12 PM', value: '12pm' },
    //     { name: '1 PM', value: '1pm' },
    //     { name: '2 PM', value: '2pm' },
    //     { name: '3 PM', value: '3pm' },
    //     { name: '4 PM', value: '4pm' },
    //     { name: '4 PM', value: '5pm' },
    //     { name: '6 PM', value: '6pm' },
    //     { name: '7 PM', value: '7pm' },
    //     { name: '8 PM', value: '8pm' },
    //     { name: '9 PM', value: '9pm' },
    //     { name: '10 PM', value: '10pm' },
    //     { name: '11 PM', value: '11pm' },
    //     { name: '12 PM', value: '12pm' },
    //     // { name: 'All', value: '' },
    // ];
    // weeksList = [
    //     { name: 'Monday', value: 'monday' },
    //     { name: 'Tuesday', value: 'tuesday' },
    //     { name: 'Wednesday', value: 'wednesday' },
    //     { name: 'Thursday', value: 'thursday' },
    //     { name: 'Friday', value: 'friday' },
    //     { name: 'Saturday', value: 'saturday' },
    //     { name: 'Sunday', value: 'sunday' },
    // ];
    // monthsList = [
    //     { name: 'January', value: 'january' },
    //     { name: 'February', value: 'february' },
    //     { name: 'March', value: 'march' },
    //     { name: 'April', value: 'april' },
    //     { name: 'May', value: 'may' },
    //     { name: 'June', value: 'june' },
    //     { name: 'July', value: 'july' },
    //     { name: 'August', value: 'august' },
    //     { name: 'September', value: 'september' },
    //     { name: 'October', value: 'october' },
    //     { name: 'November', value: 'november' },
    //     { name: 'December', value: 'december' },
    // ];
    snackBar: SnackBar;
    selectedCronType: any;
    cronType = [
        { val: 'Minutely', title: 'Minutes' },
        { val: 'Daily', title: 'Daily' },
        { val: 'Monthly', title: 'Monthly' },
        { val: 'Yearly', title: 'Yearly' },
    ];

    data: any = {
        action: 'create',
    };

    windowWidth: string;

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.handleWidthChanges(event.target.innerWidth);
    }

    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private customerService: CustomerAccountService,
        private spinner: NgxSpinnerService,
        // @Inject(MAT_DIALOG_DATA) public data: any,
        private snack: MatSnackBar,
        private batchesService: BatchesService,
        public route: ActivatedRoute
    ) {
        this.snackBar = new SnackBar(snack);
    }

    getCronExpression() {
        return this.ftpForm.get('cronExpression').value;
    }

    changeFrequencyType(event: any) {
        this.selectedCronType = event;
    }

    generatedExpression(event: any) {
        this.ftpForm.get('cronExpression').setValue(event);
    }

    getCronType(event: MatSelectChange) {
        this.selectedCronType = event.value;
    }

    ngOnInit() {
        //for width changes
        this.handleWidthChanges(window.innerWidth);

        this.createForm();
        this.selectedCronType = 'Minutely';
        console.log(this.data);
        if (this.data && this.data.action == 'create') {
            //   this.ftpForm.patchValue({ isActive: true })
        } else if (this.data && this.data.action == 'edit') {
            //   this.ftpForm.get('warehouse').disable()
        }
        // this.ftpForm.get('time').valueChanges.subscribe(value => {
        //     this.updateFormControlsBasedOnTime(value);
        // });
        this.getJobList();

        this.route.url
            .pipe(map((segments) => segments[segments.length - 1].path))
            .subscribe((lastSegment) => {
                if (lastSegment === 'add-batches') {
                    this.createRoute = true;
                } else {
                    this.createRoute = false;
                    // this.getData(lastSegment);
                }
            });
    }

    handleWidthChanges(width: number) {
        if (width <= 599) {
            this.windowWidth = 'small';
        } else if (width > 768 && width <= 960) {
            this.windowWidth = 'medium';
        } else {
            this.windowWidth = 'large';
        }
        console.log(this.windowWidth);
    }
    createForm() {
        this.ftpForm = this.formBuilder.group({
            name: [this.data?.data?.Name, Validators.required],
            cronExpression: [],
            // time: [this.data?.data?.BatchTimeName, Validators.required],
            // date: [this.data?.data?.date, Validators.required],
            // day: [this.data?.data?.time, Validators.required],
            // week: [this.data?.data?.week, Validators.required],
            // month: [this.data?.data?.month, Validators.required],
        });
        if (this.ftpForm.value.time) {
            this.updateFormControlsBasedOnTime(this.data?.data?.BatchTimeName);
        }
    }

    updateFormControlsBasedOnTime(timeValue: string): void {
        if (timeValue == 'day') {
            ['month', 'week'].forEach((control) => {
                if (this.ftpForm.contains(control)) {
                    this.ftpForm.removeControl(control);
                }
            });
        }
        if (timeValue == 'month') {
            this.ftpForm.addControl(
                'month',
                new FormControl('', Validators.required)
            );
            if (this.data && this.data.data && this.data.data.month) {
                this.ftpForm.patchValue({
                    month: this.data.data.BatchTimeValue,
                });
            }
            ['week'].forEach((control) => {
                if (this.ftpForm.contains(control)) {
                    this.ftpForm.removeControl(control);
                }
            });
        } else if (timeValue == 'week') {
            this.ftpForm.addControl(
                'week',
                new FormControl('', Validators.required)
            );
            if (this.data && this.data.data && this.data.data.BatchTimeValue) {
                this.ftpForm.patchValue({
                    week: this.data.data.BatchTimeValue,
                });
            }
            ['month'].forEach((control) => {
                if (this.ftpForm.contains(control)) {
                    this.ftpForm.removeControl(control);
                }
            });
        }
    }

    goBack() {
        window.history.back();
    }
    saveFtp() {
        console.log(this.ftpForm.value, this.data.data, '-');
        if (this.data && this.data.data && this.data.data.BatchId) {
            this.editFtp(this.ftpForm.value);
        } else {
            this.createFtp(this.ftpForm.value);
        }
    }

    editFtp(data: any) {
        // console.log(data,'data')
        // // this.spinner.show()
        // let body: any =
        // {
        //     "Name": data.name,
        //     "BatchId":this.data.data.BatchId,
        //     "date":moment(data.date).format('YYYY-MM-DD'),
        //     "time": data.day,
        //     "BatchTimeType": this.selectTimeList?.filter((item:any)=>item.value==data.time)[0]?.id,
        //     "BatchTimeName": data.time,
        //     "BatchTimeValue": data.time=='week' ? data.week:data.time=='month' ? data.month : '',
        //     "TotalJob":2,
        // }
        // console.log(body,'body')
        // this.batchesService.addUpdateBatch(body).then((response: any) => {
        //   if (response) {
        //     this.snackBar.success(response.message)
        //     this.spinner.hide()
        //     this.dialogRef.close(response)
        //   }
        // }).catch((error: any) => {
        //   this.snackBar.error(error.message)
        //   this.spinner.hide()
        // })
    }

    async createFtp(data: any) {
        // console.log(data,'data')
        // let body: any =
        // {
        //     "Name": data.name,
        //     "BatchId":0,
        //     "date":moment(data.date).format('YYYY-MM-DD'),
        //     "time": data.day,
        //     "BatchTimeType": this.selectTimeList?.filter((item:any)=>item.value==data.time)[0]?.id,
        //     "BatchTimeName": data.time,
        //     "BatchTimeValue": data.time=='week' ? data.week:data.time=='month' ? data.month : '',
        //     "TotalJob":2,
        // }
        // console.log(body,'body')
        // this.batchesService.addUpdateBatch(body).then((response: any) => {
        //   if (response) {
        //     this.snackBar.success(response.message)
        //     this.spinner.hide()
        //     this.dialogRef.close(response)
        //   }
        // }).catch((error: any) => {
        //   this.snackBar.error(error.message)
        //   this.spinner.hide()
        // })
    }

    async getJobList() {
        // this._spinner.show()
        let data: any = [];
        this.batchesService
            .getBatchData()
            .then(async (response) => {
                response.map((item: any) => {
                    if (item.JobFiles) {
                        item.JobFiles.map((file: any) => {
                            data.push(file);
                        });
                    }
                });
                this.dataSource.data = data;
                // if (response) {
                //     this.apiData = response
                //     this.batchList = response
                //     this.filterBatchList = this.searchBatch.valueChanges
                //         .pipe(
                //             startWith<string | any>(''),
                //             map(value => typeof value === 'string' ? value : value),
                //             map(name => name ? this._filterBatchName(name) : this.batchList.slice()),
                //         );
                //     setTimeout(() => {
                //         this._spinner.hide()
                //     }, 500);
                // }
            })
            .catch((e) => {
                // this._spinner.hide()
            });
    }
}
