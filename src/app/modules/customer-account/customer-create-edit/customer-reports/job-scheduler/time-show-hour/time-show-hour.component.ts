import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { AngularCommonModule } from 'app/mock-api/common/angular-common.modules';
@Component({
    selector: 'app-time-show-hour',
    templateUrl: './time-show-hour.component.html',
    styleUrls: ['./time-show-hour.component.scss'],
    standalone: true,
    imports: [AngularCommonModule, NgClass, NgIf],
})
export class TimeShowHourComponent {
    @Input() inputValue: any;
    @Input() inputFrom?: any;
    @Output() newInputValue = new EventEmitter<any>();
    @Output() closeSubTime = new EventEmitter<any>();

    ngOnInit(): void {
        console.log('inputtt', this.inputFrom);
    }
    hoursTimeArrowYear(value: any, type: any, event?: any, minutesFlag?: any) {
        const parts = value.split(':');
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
            }
            if (newMin > 59) {
                newMin = '00';
            } else if (newMin < 0) {
                newMin = 59;
            }
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
            } else if (this.inputFrom === 'minutesEnd' && newTime <= 0) {
                newTime = 23;
            } else if (newTime < 0) {
                newTime = 23;
            }
        }
        this.inputValue = `${newTime}:${newMin}`;
        const reflectValue = {
            newValue: this.inputValue,
            type: this.inputFrom,
        };
        this.newInputValue.emit(reflectValue);
    }

    closeSubRowYear() {
        this.closeSubTime.emit(-1);
    }

    checkValue(value: any, type: any) {
        if (value) {
            const parts = value.split(':');
            if (type === 'hours') {
                return parts[0];
            } else if (this.inputFrom === undefined) {
                return parts[1];
            } else {
                return '00';
            }
        } else {
            return '00';
        }
    }
}
