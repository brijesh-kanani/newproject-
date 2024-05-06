import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    FormGroup,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
    FormControl,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { fuseAnimations } from '@fuse/animations';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgIf } from '@angular/common';
import { SnackBar } from 'app/layout/common/snack-bar/snack-bar.class';
import { MatTableDataSource } from '@angular/material/table';
import { ImportService } from './customer-mapping/import.service';
import { MatTabsModule } from '@angular/material/tabs';
import { CustomerProfileComponent } from './customer-profile/customer-profile.component';
import { CustomerFtpDetailsComponent } from './customer-ftp-details/customer-ftp-details.component';
import { CustomerMappingComponent } from './customer-mapping/customer-mapping.component';
import { FileLogComponent } from './file-log/file-log.component';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterModule } from '@angular/router';
import { CustomerAccountService } from '../customer-account.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReceivingMappingComponent } from './receiving-mapping/receiving-mapping.component';
import { CustomerReportsComponent } from './customer-reports/customer-reports.component';
import { CustomerEmailsComponent } from './customer-emails/customer-emails.component';
@Component({
    selector: 'app-customer-create-edit',
    templateUrl: './customer-create-edit.component.html',
    styleUrls: ['./customer-create-edit.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [
        MatIconModule,
        FormsModule,
        ReactiveFormsModule,
        MatStepperModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatButtonModule,
        MatCheckboxModule,
        MatRadioModule,
        NgIf,
        MatTabsModule,
        CustomerProfileComponent,
        CustomerFtpDetailsComponent,
        CustomerMappingComponent,
        FileLogComponent,
        MatCardModule,
        RouterModule,
        ReceivingMappingComponent,
        CustomerReportsComponent,
        CustomerEmailsComponent,
    ],
})
export class CustomerCreateEditComponent {
    horizontalStepperForm: UntypedFormGroup;
    verticalStepperForm: UntypedFormGroup;
    @ViewChild('horizontalStepper') horizontalStepper: MatStepper;
    @ViewChild('stepper') stepper: MatStepper;
    userName: any;
    // @ViewChild(InputFileComponent) overviewComponent: InputFileComponent;
    // @ViewChild(InputMappingComponent) mappingComponent: InputMappingComponent;
    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        public deviceService: DeviceDetectorService,
        private importService: ImportService,
        private customerService: CustomerAccountService,
        private router: Router,
        private spinner: NgxSpinnerService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        if (
            this.customerService.editCrateUser &&
            this.customerService.editCrateUser.user
        ) {
            this.userName =
                this.customerService.editCrateUser?.user?.AccountName;
        } else {
            this.router.navigate(['/accounts']);
        }
    }
}
