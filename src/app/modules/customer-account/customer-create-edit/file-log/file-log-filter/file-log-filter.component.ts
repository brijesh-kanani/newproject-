import {
    Component,
    ViewEncapsulation,
    Output,
    EventEmitter,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCommonModule, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { fuseAnimations } from '@fuse/animations';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule, NgFor } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { map, startWith } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomerAccountService } from 'app/modules/customer-account/customer-account.service';
import {
    DateAdapter,
    MAT_DATE_LOCALE,
    MAT_DATE_FORMATS,
} from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

export const MY_FORMATS = {
    parse: {
        dateInput: '',
    },
    display: {
        dateInput: 'DD-MM-YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'DD-MM-YYYY',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@Component({
    selector: 'app-file-log-filter',
    templateUrl: './file-log-filter.component.html',
    styleUrls: ['./file-log-filter.component.scss'],
    standalone: true,
    imports: [
        MatCommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatButtonModule,
        MatSelectModule,
        CommonModule,
        NgFor,
        MatExpansionModule,
        MatIconModule,
    ],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE],
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
        DatePipe,
    ],
})
export class FileLogFilterComponent {
    @Output() filtersApplied = new EventEmitter<any>();
    filterForm: FormGroup;
    filtercarrierNumbers: any;
    filtercarrierName: any;
    carrierNumbersList: any = [];
    carrierNameList: any = [];
    searchAccount = new FormControl('');
    accountList: any;
    filterAccountList: any;
    statusList: any = [
        {
            value: 'success',
            name: 'Success',
        },
        {
            value: 'warning',
            name: 'Warning',
        },
        {
            value: 'error',
            name: 'Error',
        },
    ];

    fileTypeList: any = [
        {
            value: 'order',
            name: 'Order',
        },
        {
            value: 'receipt',
            name: 'Receipt',
        }
    ];
    onKeydown(e: KeyboardEvent, i: HTMLInputElement) {
        i.onkeydown?.(e);
        e.stopPropagation();
    }
    constructor(
        private fb: FormBuilder,
        private _spinner: NgxSpinnerService,
        private customerAccountService: CustomerAccountService
    ) {
        this.filterForm = this.fb.group({
            fromDate: [new Date()],
            toDate: [new Date()],
            account: [''],
            status: [''],
            fileType: [''],
        });
    }

    ngOnInit() {
        this.getAccountList();
    }

    getAccountList() {
        let filter = { name: '', status: 'all' };
        this._spinner.show();
        this.customerAccountService
            .getAccountList(filter)
            .then((response) => {
                if (response) {
                    this.accountList = response.account;
                    this.filterAccountList =
                        this.searchAccount.valueChanges.pipe(
                            startWith<string | any>(''),
                            map((value) =>
                                typeof value === 'string' ? value : value
                            ),
                            map((name) =>
                                name
                                    ? this._filterAccountName(name)
                                    : this.accountList.slice()
                            )
                        );
                    this._spinner.hide();
                }
            })
            .catch((e) => {
                this._spinner.hide();
                console.log(e.error.message, 'error');
            });
    }

    private _filterAccountName(name: string): any[] {
        const filterValue = name.toLowerCase();
        return this.accountList.filter((option) =>
            option.AccountName.toLowerCase().includes(filterValue.toLowerCase())
        );
    }

    applyFilters() {
        const filters = this.filterForm.value;
        this.filtersApplied.emit(filters);
    }
}
