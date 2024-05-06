import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { BatchesService } from 'app/modules/reports/batches/batches.service';
import {
    AbstractControl,
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { SnackBar } from 'app/layout/common/snack-bar/snack-bar.class';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ImportService } from 'app/modules/customer-account/customer-create-edit/customer-mapping/import.service';
import { FileLogService } from 'app/modules/file-log/file-log.service';
import { SharedService } from 'app/mock-api/common/shared.service';
import { Location } from '@angular/common';
import { EditJobReportDialogComponent } from './edit-job-report-dialog/edit-job-report-dialog.component';
import { CustomerAccountService } from 'app/modules/customer-account/customer-account.service';
import { map, startWith } from 'rxjs';
import { AngularCommonModule } from 'app/mock-api/common/angular-common.modules';
import { MatChipInputEvent } from '@angular/material/chips';
@Component({
    selector: 'JobsDetails',
    templateUrl: './JobsDetails.component.html',
    styleUrls: ['./JobsDetails.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [AngularCommonModule],
})
export class JobsDetailsComponent implements OnInit {
    @ViewChild('emailInput') emailInput: ElementRef<HTMLInputElement>;
    ftpForm: FormGroup;
    Form: FormGroup;
    emailForm: FormGroup;
    jobForm: FormGroup;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    dataSource = new MatTableDataSource();
    viewMappingData: any = [];
    displayedColumns: string[] = ['Id', 'Email', 'Action'];
    // displayedColumns: string[] = ['FileName', 'ReportId', 'TemplateId', 'action'];
    customerList: any = [];
    filteredData: any = [];
    totalItemCount: number;
    snackBar: SnackBar;
    apiData: any;
    mainData: any;
    inputControl = new FormControl(''); // Separate control for managing input
    users: any = [];
    searchAccount = new FormControl('');
    accountList: any;
    filterAccountList: any;
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
    emailRows: any[];
    constructor(
        private location: Location,
        private snack: MatSnackBar,
        private dialog: MatDialog,
        private _router: Router,
        private formBuilder: FormBuilder,
        private _spinner: NgxSpinnerService,
        private sharedService: SharedService,
        public batchesService: BatchesService,
        private importService: ImportService,
        private cdr: ChangeDetectorRef,
        private fileLogService: FileLogService,
        private fb: FormBuilder,
        private customerAccountService: CustomerAccountService
    ) {
        this.snackBar = new SnackBar(snack);
        if (!this.batchesService.jobDetailsData) {
            this._router.navigate(['/reports/jobs']);
        }
        // else if (!(this.batchesService.jobDetailsData)) {
        //     this._router.navigate(['/reports/jobs'])
        // }
    }

    jobList = [
        { name: 'Ftp', value: 'Ftp' },
        { name: 'Email', value: 'Email' },
        { name: 'All', value: '' },
    ];
    filterForm: FormGroup;

    onKeydown(e: KeyboardEvent, i: HTMLInputElement) {
        i.onkeydown?.(e);
        e.stopPropagation();
    }

    ngOnInit() {
        this.emailRows = [];
        if (
            this.batchesService.jobDetailsData &&
            this.batchesService.jobDetailsData.data &&
            this.batchesService.jobDetailsData.data.Data
        ) {
            this.dataSource =
                this.batchesService.jobDetailsData.data.Data.ReportItems;
        }
        setTimeout(() => {
            if (this.paginator) {
                this.paginator.pageSize = 500;
                this.paginator.pageIndex = 0;
            }
            this.dataSource.sort = this.sort;
        }, 100);
        this.getAccountList();

        this.filterForm = this.fb.group({
            name: [''],
            type: [''],
        });
        this.ftpForm = this.fb.group({
            port: [
                this.batchesService?.jobDetailsData?.data?.Data?.Port,
                [
                    Validators.pattern(/^-?(0|[1-9]\d*)?$/),
                    Validators.maxLength(8),
                    Validators.required,
                ],
            ],
            host: [
                this.batchesService?.jobDetailsData?.data?.Data?.Host,
                Validators.required,
            ],
            username: [
                this.batchesService?.jobDetailsData?.data?.Data?.UserName,
                Validators.required,
            ],
            password: [
                this.batchesService?.jobDetailsData?.data?.Data?.Password,
                Validators.required,
            ],
            name: [
                this.batchesService?.jobDetailsData?.data?.Data?.Name,
                Validators.required,
            ],
            // accountType: [this.batchesService?.jobDetailsData?.data?.Data?.AccountType, Validators.required],
            jobType: [
                this.batchesService?.jobDetailsData?.data?.Data?.jobType,
                Validators.required,
            ],
            // isActive: [this.batchesService?.jobDetailsData?.data?.Data?.isActive, Validators.required],
            //   warehouse: [this.data?.data?.WarehouseId, Validators.required],
            //   fileName: [this.data?.data?.fileName],
            folderName: [
                this.batchesService?.jobDetailsData?.data?.Data?.Folder,
                Validators.required,
            ],
            archiveFolder: [
                this.batchesService?.jobDetailsData?.data?.Data?.ArchiveFolder,
                Validators.required,
            ],
        });
        this.Form = this.fb.group({
            accountType: ['', Validators.required],
        });

        this.jobForm = this.fb.group({
            fileName: [
                this.batchesService?.jobDetailsData?.data?.FileName,
                Validators.required,
            ],
            customerName: [
                this.batchesService?.jobDetailsData?.data?.Customer,
                Validators.required,
            ],
            jobType: [
                this.batchesService?.jobDetailsData?.data?.JobTypeId,
                Validators.required,
            ],
            email: [
                this.batchesService?.jobDetailsData?.data?.JobTypeId,
                Validators.required,
            ],
            emailTitle: [
                this.batchesService?.jobDetailsData?.data?.JobTypeId,
                Validators.required,
            ],
            emailSubject: [
                this.batchesService?.jobDetailsData?.data?.JobTypeId,
                Validators.required,
            ],
            format: [
                this.batchesService?.jobDetailsData?.data?.JobTypeId,
                Validators.required,
            ],
            report: [
                this.batchesService?.jobDetailsData?.data?.JobTypeId,
                Validators.required,
            ],
            ftp: [
                this.batchesService?.jobDetailsData?.Data?.ftp,
                Validators.required,
            ],
            account: [
                this.batchesService?.jobDetailsData?.data?.Data?.AccountId,
                Validators.required,
            ],
        });

        if (
            this.batchesService.jobDetailsData &&
            this.batchesService.jobDetailsData.data &&
            this.batchesService.jobDetailsData.data.JobTypeId
        ) {
            this.jobForm.get('jobType').disable();
        }

        // this.emailInputControl = new FormControl('', [Validators.required, this.emailsValidator()]);
        this.emailForm = this.fb.group({
            // emailChips: ['', [Validators.required, this.emailsValidator()]],
            emailChips: this.fb.array(
                [],
                [Validators.required, this.emailsValidator()]
            ),
            // emailChips: this.fb.array([]),
            subject: [
                this.batchesService?.jobDetailsData?.data?.Data?.Subject,
                Validators.required,
            ],
            title: [
                this.batchesService?.jobDetailsData?.data?.Data?.Id,
                Validators.required,
            ],
        });

        this.inputControl.valueChanges.subscribe((value) => {
            this.syncFormArrayWithInput(value);
        });
    }

    get emailChips(): FormArray {
        return this.emailForm.get('emailChips') as FormArray;
    }

    private _filterAccountName(name: string): any[] {
        const filterValue = name.toLowerCase();
        return this.accountList.filter((option) =>
            option.AccountName.toLowerCase().includes(filterValue.toLowerCase())
        );
    }
    async getAccountList() {
        this._spinner.show();
        let filter = { name: '', status: 'all' };
        // await this.customerAccountService.getAccountList(filter).then((response) => {
        if (
            this.batchesService.accountList &&
            this.batchesService.accountList.length > 0
        ) {
            this.accountList = this.batchesService.accountList;
            // if (this.accountList) {
            //     this.filterForm.patchValue({ account: this.accountList[0].AccountNumber })
            // }
            this.filterAccountList = this.searchAccount.valueChanges.pipe(
                startWith<string | any>(''),
                map((value) => (typeof value === 'string' ? value : value)),
                map((name) =>
                    name
                        ? this._filterAccountName(name)
                        : this.accountList.slice()
                )
            );
            this._spinner.hide();
        }
        // }).catch((e) => {
        //     this._spinner.hide()
        //     console.log(e.error.message, 'error')
        // })
        // this.checkExitAccount()
    }
    syncFormArrayWithInput(value: string): void {
        const emails = value
            .split(',')
            .map((email) => email.trim())
            .filter((email) => this.validateEmail(email));
        this.emailChips.clear();
        emails.forEach((email) => this.emailChips.push(this.fb.control(email)));
    }

    onInputBlur(): void {
        const emails = this.inputControl.value
            .split(',')
            .map((email) => email.trim())
            .filter((email) => email);
        this.syncEmailChipsWithEmails(emails);
    }

    removeEmail(index: number): void {
        // Remove the specified email from the FormArray
        this.emailChips.removeAt(index);

        // Update the input field to reflect the current state of the FormArray
        const updatedEmails = this.emailChips.value.join(', ');
        this.inputControl.setValue(updatedEmails, { emitEvent: false });
    }

    // Inside your EmailInputComponent class

    syncEmailChipsWithEmails(emails: string[]): void {
        // Clear the existing FormArray to start fresh
        while (this.emailChips.length !== 0) {
            this.emailChips.removeAt(0);
        }

        // Iterate over each email string, validate it, and add it to the FormArray
        emails.forEach((email) => {
            if (this.validateEmail(email)) {
                this.emailChips.push(new FormControl(email));
            }
        });

        // Optionally, you could set the input control's value to the sanitized list of emails
        // This step can clean the input field from any invalid emails that were not added to the FormArray
        const sanitizedEmailList = this.emailChips.value.join(', ');
        this.inputControl.setValue(sanitizedEmailList, { emitEvent: false });

        // Update the validity state of the FormArray based on the new values
        this.emailChips.updateValueAndValidity();

        // Reflect the FormArray's validation state on the inputControl to show errors
        if (this.emailChips.invalid) {
            this.inputControl.setErrors({ ...this.emailChips.errors });
        } else {
            this.inputControl.setErrors(null);
        }
    }

    validateEmail(email: string): boolean {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
    }

    emailsValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            if (!control.value || !control.value.length) {
                return null; // don't validate empty value
            }
            const emails = control.value;
            const isValid = emails.every((email) => this.validateEmail(email));
            return isValid ? null : { invalidEmails: { value: control.value } };
        };
    }

    applyFilters() {
        const filters = this.filterForm.value;
        if ((filters?.name || filters?.type) && this.apiData?.length > 0) {
            // console.log(this.apiData[0]?.JobFiles)
            let newArr = [];
            if (filters?.name && filters?.type) {
                newArr = this.apiData?.filter(
                    (item: any) =>
                        item?.FileName?.toLowerCase().includes(
                            this.filterForm.value?.name?.toLowerCase()
                        ) && item.JobTypeId === filters?.type
                );
            } else if (filters?.name) {
                newArr = this.apiData?.filter((item: any) =>
                    item?.FileName?.toLowerCase().includes(
                        this.filterForm.value?.name?.toLowerCase()
                    )
                );
            } else if (filters?.type) {
                newArr = this.apiData?.filter(
                    (item: any) => item.JobTypeId === filters?.type
                );
            }
            // let newArr = this.apiData?.filter((item: any) => item?.FileName?.toLowerCase().includes(this.filterForm.value?.name?.toLowerCase()))
            // console.log(newArr, 'newArr')
            this.dataSource.data = newArr;
            if (this.paginator) {
                this.paginator.pageSize = 500;
                this.paginator.pageIndex = 0;
            }
        } else {
            this.dataSource.data = this.apiData;
            if (this.dataSource.paginator) {
                this.dataSource.paginator.length = this.apiData.length;
            }
        }

        // this.filtersApplied.emit(filters);
    }

    onPageChange(event: any) {
        if (this.apiData?.length > 0 && this.apiData?.length > 0) {
            this.getGroupData(event);
        }
    }

    async getGroupData(event: any) {
        // console.log('c1');
        // console.log(this.searchData);
        const page = event?.pageIndex + 1 || 1; // Pagination indexes are zero-based, so add 1
        const pageSize = event?.pageSize || 500;
        // console.log(page, pageSize);
        // console.log(page, pageSize);
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        this.dataSource.data = this.apiData.slice(startIndex, endIndex);
        // this.paginator = response[0].JobFiles.length;
        this.totalItemCount =
            (this.apiData.length > 0 && this.apiData.length) || 500;
    }

    editJobReport(data: any) {
        const dialogRef = this.dialog.open(EditJobReportDialogComponent, {
            width: '100%',
            data: { action: 'edit', data: data },
        });
        dialogRef.afterClosed().subscribe((data) => {
            if (data) {
                // this.getFTPList()
            }
        });
    }

    createJobReport() {
        const dialogRef = this.dialog.open(EditJobReportDialogComponent, {
            width: '100%',
            data: { action: 'create' },
        });
        dialogRef.afterClosed().subscribe((data) => {
            if (data) {
                // this.getFTPList()
            }
        });
    }

    viewFileLog(data: any) {
        this.fileLogService.filters.account = data.AccountNumber;
        this._router.navigate(['/file-logs']);
    }

    goBack() {
        this.location.back();
    }

    saveJobDetails() {
        console.log(this.jobForm.value, 'jobForm');
        // this.jobForm.get('jobType').enable()
        // if (this.jobForm.value.jobType == 'Ftp') {
        //     console.log(this.ftpForm.value, 'ftpForm')
        // } else {
        //     console.log(this.emailForm.value, 'emailForm')
        // }
        // if (this.batchesService.jobDetailsData && this.batchesService.jobDetailsData.data && this.batchesService.jobDetailsData.data.JobTypeId) {
        //     this.jobForm.get('jobType').disable()
        // }
    }

    addMoreEmails(emailInput: MatChipInputEvent): void {
        if (emailInput.value) {
            const newRowId = this.emailRows.length + 1;
            this.emailRows.push({ id: newRowId, value: emailInput.value });
            this.emailRows = [...this.emailRows];
            let emailsField;
            // if (this.editAlert.get('emails').value) {
            //     emailsField = `${this.editAlert.get('emails').value}, ${emailInput.value}`
            // } else {
            //     emailsField = emailInput.value
            // }
            // this.editAlert.get('emails').setValue(emailsField)
            // console.log('sdsds', this.editAlert.get('emails').value)
            emailInput.value = '';
        }
    }

    removeMoreEmails(index: number) {
        const removeIndex = this.emailRows.findIndex((row) => row.id === index);
        this.emailRows = this.emailRows.filter((row) => row.id !== index);
        // if (this.editAlert.get('emails').value) {
        //     const emailArray = this.editAlert.get('emails').value.split(', ');
        //     emailArray.splice(removeIndex, 1)
        //     const updatedEmails = emailArray.join(', ');
        //     this.editAlert.get('emails').setValue(updatedEmails)

        // }
    }
}
