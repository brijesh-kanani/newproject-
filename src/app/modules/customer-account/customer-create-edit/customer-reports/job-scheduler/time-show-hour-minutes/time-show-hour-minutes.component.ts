import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import { AngularCommonModule } from 'app/mock-api/common/angular-common.modules';

@Component({
    selector: 'app-time-show-hour-minutes',
    templateUrl: './time-show-hour-minutes.component.html',
    styleUrls: ['./time-show-hour-minutes.component.scss'],
    standalone: true,
    imports: [NgIf, AngularCommonModule],
})
export class TimeShowHourMinutesComponent {
    @Input() row: any;
    @Input() dailyTimeRows: any;
    @Input() rowNo: any;
    @Output() closeSubTime = new EventEmitter<any>();

    ngOnInit(): void {
        console.log('roww', this.dailyTimeRows, this.row);
    }

    closeSubRow() {
        this.closeSubTime.emit(-1);
    }

    hoursTimeArrow(i: any, type: any, event?: any, minutesFlag?: any) {
        let currentTime = this.dailyTimeRows.find((index) => index.id === i);
        const index = this.dailyTimeRows.findIndex((index) => index.id === i);

        console.log('ii', currentTime);
        // if (currentTime.value) {
        const parts = currentTime.value.split(':');
        let newTime = parts[0] ? parts[0] : '00';
        let newMin = parts[1] ? parts[1] : '00';
        if (minutesFlag === 'minutes') {
            if (type === 'increment') {
                newMin = `${parts[1] - 1}`;
            } else if (type === 'decrement') {
                parts[1]++;
                newMin = `${parts[1]}`;
            } else if (type === 'setMinutes') {
                newMin = `${event.target.value}`;
                if (newMin.toString().length > 2) {
                    newMin = newMin.replace(/^0+/, '');
                }
            }

            if (newMin > 59) {
                newMin = '00';
            } else if (newMin < 0) {
                newMin = 59;
            }
            //Update all hour section
            this.dailyTimeRows.forEach((element) => {
                const minVal = element.value.split(':');
                element.value = `${minVal[0]}:${newMin}`;
            });
        } else {
            if (type === 'increment') {
                newTime = `${parts[0] - 1}`;
            } else if (type === 'decrement') {
                parts[0]++;
                newTime = `${parts[0]}`;
            } else if (type === 'setHours') {
                newTime = `${event.target.value}`;
                if (newTime.toString().length > 2) {
                    newTime = newTime.replace(/^0+/, '');
                }
            }
            if (newTime > 23) {
                newTime = '00';
            } else if (newTime < 0) {
                newTime = 23;
            }
        }
        this.dailyTimeRows[index].value = `${newTime}:${newMin}`;

        // }
        this.dailyTimeRows = [...this.dailyTimeRows];
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
}
