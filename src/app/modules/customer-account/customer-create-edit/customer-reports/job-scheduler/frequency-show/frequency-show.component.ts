import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    HostListener,
    Input,
    Output,
    SimpleChanges,
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { TimeShowHourComponent } from '../time-show-hour/time-show-hour.component';
import { TimeShowHourMinutesComponent } from '../time-show-hour-minutes/time-show-hour-minutes.component';
import { AngularCommonModule } from 'app/mock-api/common/angular-common.modules';

@Component({
    selector: 'app-frequency-show',
    templateUrl: './frequency-show.component.html',
    styleUrls: ['./frequency-show.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        AngularCommonModule,
        NgFor,
        ReactiveFormsModule,
        TimeShowHourComponent,
        TimeShowHourMinutesComponent,
    ],
})
export class FrequencyShowComponent {
    frequencyForm: FormGroup;
    @Input() type: any;
    @Input() cronExpression: any;
    @Output() changeType = new EventEmitter<any>();
    @Output() newExpression = new EventEmitter<any>();
    dailyOrNot: boolean;
    weekDays: { val: string; title: string }[] = [
        { val: '1', title: 'Monday' },
        { val: '2', title: 'Tuesday' },
        { val: '3', title: 'Wednesday' },
        { val: '4', title: 'Thursday' },
        { val: '5', title: 'Friday' },
        { val: '6', title: 'Saturday' },
        { val: '0', title: 'Sunday' },
    ];

    monthsOptions: { val: string; title: string }[] = [
        { val: '1', title: 'January' },
        { val: '2', title: 'February' },
        { val: '3', title: 'March' },
        { val: '4', title: 'April' },
        { val: '5', title: 'May' },
        { val: '6', title: 'June' },
        { val: '7', title: 'July' },
        { val: '8', title: 'August' },
        { val: '9', title: 'September' },
        { val: '10', title: 'October' },
        { val: '11', title: 'November' },
        { val: '12', title: 'December' },
    ];
    filterMonthsOptions: any;
    dailyTimeRows: any;
    monthlyTimeRows: any;

    indexOfMainTimeInput: number;
    datesArray: number[] = Array.from({ length: 31 }, (_, i) => i + 1);

    valueTimeYear: String = '03:00';
    showTimeYear: boolean;
    displayMsg: any;
    finalExpression: any;
    startTimeRow: any;
    showMinutesStart: boolean;
    showMinutesEnd: boolean;
    frequencyButton: boolean;

    windowWidth: string;

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.handleWidthChanges(event.target.innerWidth);
    }

    constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.type) {
            console.log('dsdsds', this.type);
            this.displayMsg = '';
            setTimeout(() => {
                this.addValidation();
            }, 100);
        }
        //Show selected frequency in edit
        if (changes.cronExpression) {
            if (this.cronExpression) {
                setTimeout(() => {
                    this.showFrequency();
                }, 100);
            }
        }
    }

    ngOnInit(): void {
        //for width changes
        this.handleWidthChanges(window.innerWidth);
        //Static
        this.dailyTimeRows = [{ id: 1, value: '12:30' }];
        this.monthlyTimeRows = [{ id: 1, value: '06:30' }];
        this.valueTimeYear = '3:00';

        //Form Initialize
        this.formInitialize();

        //By default
        this.filterMonthsOptions = this.monthsOptions;
        // this.dailyOrNot = true;
        this.toggleDailyStatus();

        //year filter
        this.frequencyForm
            .get('filterYearlyMonth')
            .valueChanges.subscribe((value) => {
                if (value) {
                    this.filterMonthsOptions = this.monthsOptions.filter(
                        (ele) =>
                            ele.title
                                .toLowerCase()
                                .includes(value.toLowerCase())
                    );
                }
            });
    }

    // change the variable when width changes
    handleWidthChanges(width: number) {
        if (width <= 768) {
            this.windowWidth = 'small';
        } else if (width > 768 && width <= 960) {
            this.windowWidth = 'medium';
        } else {
            this.windowWidth = 'large';
        }
        console.log(this.windowWidth);
    }

    addValidation() {
        let changeCase = this.type?.toLowerCase();
        if (changeCase === 'minutely') {
            changeCase = 'minutes';
        }
        Object.keys(this.frequencyForm.controls).forEach((key) => {
            const control = this.frequencyForm.get(key);
            if (key.includes(changeCase)) {
                control.setValidators(Validators.required);
                control.updateValueAndValidity();
            } else {
                if (control) {
                    control.setValidators(null);
                    control.updateValueAndValidity();
                }
            }
        });
    }

    showFrequency() {
        const splitExpression = this.cronExpression.split(' ');
        const checkMin = splitExpression[0].split('/');
        const checkHour = splitExpression[1].split('/');
        console.log('checkMin', checkMin, 'checkHour', checkHour);
        if (splitExpression[3] !== '*') {
            //Yearly
            this.type = 'Yearly';
            let outputArray = splitExpression[3]
                .split(',')
                .map((num) => `${num.trim()}`);
            this.frequencyForm.get('yearlyMonth').setValue(outputArray);
            this.frequencyForm
                .get('yearlyDate')
                .setValue(Number(splitExpression[2]));
            const time = `${splitExpression[1]}:${splitExpression[0]}`;
            this.valueTimeYear = time;
            this.frequencyForm.get('yearlyTime').setValue(time);
        } else if (splitExpression[2] !== '*') {
            //Monthly
            this.type = 'Monthly';
            let outputArray = splitExpression[2]
                .split(',')
                .map((num) => parseInt(num.trim()));
            this.frequencyForm.patchValue({
                monthlyDate: outputArray,
            });
            this.monthlyTimeRows = splitExpression[1]
                .split(',')
                .map((num, index) => ({
                    id: index + 1,
                    value: `${num.trim()}:${splitExpression[0]}`,
                }));
        } else if (splitExpression[4] !== '*') {
            //Daily
            this.type = 'Daily';
            const checkDash = splitExpression[4].split('-');

            let outputArray;
            if (checkDash.length === 1) {
                outputArray = splitExpression[4]
                    .split(',')
                    .map((num) => `${num.trim()}`);
            } else {
                outputArray = ['1', '2', '3', '0', '4', '5', '6'];
                this.dailyOrNot = true;
            }
            console.log('chcc', outputArray);
            this.frequencyForm.get('dailyDay').setValue(outputArray);
            this.dailyTimeRows = splitExpression[1]
                .split(',')
                .map((num, index) => ({
                    id: index + 1,
                    value: `${num.trim()}:${splitExpression[0]}`,
                }));
        } else {
            //Minutes
            this.type = 'Minutely';
            if (splitExpression[1] !== '*') {
                const getHour = splitExpression[1].split('/');
                if (getHour.length > 1) {
                    const combinedTime =
                        parseInt(getHour[1]) * 60 +
                        parseInt(splitExpression[0]);
                    this.frequencyForm
                        .get('minutesTime')
                        .setValue(combinedTime);
                } else {
                    const getMin = splitExpression[0].split('/');
                    this.frequencyForm.get('minutesTime').setValue(getMin[1]);
                }

                if (getHour[0] !== '*') {
                    const getMins = getHour[0].split('-');
                    this.frequencyForm.get('minutesStart').setValue(getMins[0]);
                    this.frequencyForm.get('minutesEnd').setValue(getMins[1]);
                }
            } else if (splitExpression[0] !== '*') {
                const getMin = splitExpression[0].split('/');
                this.frequencyForm.get('minutesTime').setValue(getMin[1]);
            } else {
                this.frequencyForm.get('minutesTime').setValue(1);
            }
        }
        this.changeType.emit(this.type);
    }

    formInitialize() {
        this.frequencyForm = this.fb.group({
            minutesTime: ['5', [Validators.min(1)]],
            minutesStart: ['6'],
            minutesEnd: ['18'],
            dailyDay: [],
            // dailyTime: [''],
            monthlyDate: [[1, 2]],
            // monthlyTime: [''],
            yearlyMonth: [['1']],
            yearlyDate: [15],
            yearlyTime: [this.valueTimeYear],
            filterYearlyMonth: [],
        });
    }

    getMinutesStart() {
        return this.frequencyForm.get('minutesStart').value;
    }

    getMinutesEnd() {
        return this.frequencyForm.get('minutesEnd').value;
    }

    //For daily and monthly cron show
    checkDaily(val: any) {
        const selectDays = this.frequencyForm.get('dailyDay').value;
        // console.log('selectDays',selectDays)
        if (this.dailyOrNot) {
            return true;
        } else {
            if (selectDays.includes(val)) {
                return true;
            } else {
                if (val === selectDays) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    }

    toggleDailyStatus(event?: any) {
        // this.dailyOrNot = event?.checked ? event?.checked : this.dailyOrNot;
        if (event) {
            this.dailyOrNot = event.checked;
        }
        const selectedDays = [];
        if (this.dailyOrNot) {
            this.weekDays.map((ele) => {
                selectedDays.push(ele.val);
            });
        }
        this.frequencyForm.get('dailyDay').setValue(selectedDays);
    }

    selectDay(day: any) {
        console.log('4555');
        this.dailyOrNot = false;
        const selectedDays = this.frequencyForm.get('dailyDay').value || [];
        if (selectedDays.includes(day)) {
            const index = selectedDays.indexOf(day);
            selectedDays.splice(index, 1);
        } else {
            selectedDays.push(day);
        }
        this.frequencyForm.get('dailyDay').setValue(selectedDays);
        if (selectedDays.length === 7) {
            this.dailyOrNot = true;
        }
    }

    mainTimeInput(event: any, i: number) {
        this.indexOfMainTimeInput = i;
    }

    addNewDailyRows(type?: any) {
        let getType = this.dailyTimeRows;
        if (type === 'monthly') {
            getType = this.monthlyTimeRows;
        }
        const newRowId = getType.length + 1;
        //For same mins in every hour selection
        const previousMins = getType[0].value.split(':');
        getType.push({ id: newRowId, value: `00:${previousMins[1]}` });
    }

    removeNewDailyRows(index: number, type?: any) {
        if (type === 'monthly') {
            this.monthlyTimeRows = this.monthlyTimeRows.filter(
                (row) => row.id !== index
            );
        } else {
            this.dailyTimeRows = this.dailyTimeRows.filter(
                (row) => row.id !== index
            );
        }
    }

    closeSubRow(event: any) {
        this.indexOfMainTimeInput = event;
    }

    // For yearly Cron Type
    mainTimeYear() {
        this.showTimeYear = true;
    }

    closeSubRowYear() {
        this.showTimeYear = false;
        this.showMinutesStart = false;
    }

    generateFrequency() {
        console.log('dsdsds', this.frequencyForm);
        this.frequencyButton = true;
        if (this.frequencyForm.status === 'VALID') {
            let minutes = '*',
                hours = '*',
                date = '*',
                month = '*',
                week = '*';
            const formValues = this.frequencyForm.value;
            // console.log('formn', formValues)
            if (this.type === 'Minutely') {
                if (formValues.minutesTime < 60) {
                    minutes = `*/${formValues.minutesTime}`;
                } else {
                    //entered value is for hours
                    const calculatedHours = this.calculateHours(
                        formValues.minutesTime
                    );
                    const parts = calculatedHours.split(':');
                    hours = parts[0] ? `*/${parts[0]}` : '*';
                    minutes = parts[1] ? parts[1] : '*';
                }
                if (formValues.minutesStart && formValues.minutesEnd) {
                    let hourRange = `${formValues.minutesStart}-${formValues.minutesEnd}`;
                    if (hours !== '*') {
                        hours = hours.replace(/\*/g, hourRange);
                    } else {
                        hours = hourRange;
                    }
                }
            } else if (this.type === 'Daily') {
                //for selected day
                if (this.dailyOrNot) {
                    week = '0-6';
                } else {
                    const dayValues =
                        formValues.dailyDay.length > 1
                            ? formValues.dailyDay.join(',')
                            : formValues.dailyDay[0];
                    week = dayValues ? dayValues : '*';
                }

                // selected time
                const times = [];
                this.dailyTimeRows.map((row) => {
                    const hrs = row.value.split(':');
                    times.push(hrs[0]);
                    minutes = hrs[1];
                });
                const joinedHrs = times.length > 1 ? times.join(',') : times[0];
                hours = joinedHrs;
            } else if (this.type === 'Monthly') {
                //for selected date
                if (formValues.monthlyDate.length > 0) {
                    date = formValues.monthlyDate;
                }

                // selected time
                const times = [];
                this.monthlyTimeRows.map((row) => {
                    const hrs = row.value.split(':');
                    times.push(hrs[0]);
                    minutes = hrs[1];
                });
                const joinedHrs = times.length > 1 ? times.join(',') : times[0];
                hours = joinedHrs;
            } else if (this.type === 'Yearly') {
                // for selected month
                const monthValues =
                    formValues.yearlyMonth.length > 1
                        ? formValues.yearlyMonth.join(',')
                        : formValues.yearlyMonth[0];
                month = monthValues ? monthValues : '*';

                // for selected date
                date = formValues.yearlyDate ? formValues.yearlyDate : '*';

                // for selected Time
                const split = formValues.yearlyTime.split(':');
                hours = split[0] ? split[0] : '*';
                minutes = split[1] ? split[1] : '*';
            }

            this.finalExpression = `${minutes} ${hours} ${date} ${month} ${week}`;
            console.log('this.finalExpression', this.finalExpression);
            // this.displayMsg = cronstrue.toString(this.finalExpression)
            this.newExpression.emit(this.finalExpression);
        }
    }

    calculateHours(mins: any) {
        const hours = Math.floor(mins / 60);
        const remainingMinutes = mins % 60;
        return (
            hours + ':' + (remainingMinutes < 10 ? '0' : '') + remainingMinutes
        );
    }

    checkValue(value: any, type: any) {
        if (value) {
            const parts = value.split(':');
            if (type === 'hours') {
                return parts[0];
            } else {
                return parts[1];
            }
        } else {
            return '00';
        }
    }

    reflectNewVal(event: any) {
        if (event.type === undefined) {
            this.valueTimeYear = event.newValue;

            this.frequencyForm.get('yearlyTime').setValue(this.valueTimeYear);
        } else {
            const val = event.newValue.split(':');
            this.frequencyForm.get(event.type).setValue(val[0]);
        }
    }

    minutesStart() {
        this.showMinutesStart = true;
        this.showMinutesEnd = false;
    }

    minutesEnd() {
        this.showMinutesEnd = true;
        this.showMinutesStart = false;
    }
}
