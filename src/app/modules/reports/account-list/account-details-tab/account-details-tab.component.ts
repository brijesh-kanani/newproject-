import { NgIf } from '@angular/common';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { Router, RouterModule } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { AngularCommonModule } from 'app/mock-api/common/angular-common.modules';
import { AccountsService } from '../accounts.service';
import { ReportFtpDetailsComponent } from './report-ftp-details/report-ftp-details.component';
import { ReportEmailDetailsComponent } from './report-email-details/report-email-details.component';

@Component({
  selector: 'app-account-details-tab',
  templateUrl: './account-details-tab.component.html',
  styleUrls: ['./account-details-tab.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  standalone: true,
  imports: [AngularCommonModule, ReportFtpDetailsComponent, ReportEmailDetailsComponent],

})
export class AccountDetailsTabComponent {
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
  constructor(private _formBuilder: UntypedFormBuilder, private router: Router, private accountServices: AccountsService) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    if (this.accountServices.reportAccountsDetails && this.accountServices.reportAccountsDetails.user) {
      this.userName = this.accountServices.reportAccountsDetails?.user?.AccountName
    } else {
      this.router.navigate(['/reports/accounts'])
    }
  }

}