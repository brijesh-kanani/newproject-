import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators, FormControl } from '@angular/forms';
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
import { MatTabsModule } from '@angular/material/tabs';
import { ImportService } from './import.service';
import { InputFileComponent } from './input-file/input-file.component';
import { InputMappingComponent } from './input-mapping/input-mapping.component';
import { CustomerAccountService } from '../../customer-account.service';

@Component({
  selector: 'app-customer-mapping',
  templateUrl: './customer-mapping.component.html',
  styleUrls: ['./customer-mapping.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  standalone: true,
  imports: [MatIconModule, FormsModule, ReactiveFormsModule, MatStepperModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatButtonModule, MatCheckboxModule, MatRadioModule, NgIf, MatTabsModule, CustomerMappingComponent, InputFileComponent, InputMappingComponent],
})
export class CustomerMappingComponent {
  horizontalStepperForm: UntypedFormGroup;
  verticalStepperForm: UntypedFormGroup;
  updateMapping: boolean = false
  @ViewChild('horizontalStepper') horizontalStepper: MatStepper;
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild(InputFileComponent) overviewComponent: InputFileComponent;
  @ViewChild(InputMappingComponent) mappingComponent: InputMappingComponent;
  /**
   * Constructor
   */
  constructor(private _formBuilder: UntypedFormBuilder, public deviceService: DeviceDetectorService, private importService: ImportService, private customerService: CustomerAccountService) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {

    // Horizontal stepper form
    this.horizontalStepperForm = this._formBuilder.group({
      step1: this._formBuilder.group({
        jsonData: ['', [Validators.required]],
        selectTemplete: [''],
        isHeader: [false],
      }),
      step2: this._formBuilder.group({
      }),
      step3: this._formBuilder.group({},),
    });
    // Vertical stepper form
    this.verticalStepperForm = this._formBuilder.group({
      step1: this._formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        country: ['', Validators.required],
        language: ['', Validators.required],
      }),
      step2: this._formBuilder.group({
      }),
      step3: this._formBuilder.group({
      },
      ),
    });

    this.importService.nextStepEvent.subscribe(() => {
      this.goToNextStep();
    });

    const TemplateChanges = this.horizontalStepperForm.get('step1.selectTemplete') as FormGroup;
    TemplateChanges.valueChanges.subscribe(data => {
      if (data && data.mappingAttributes && data.mappingAttributes.length > 0) {
        this.updateMapping = true;
      } else {
        this.updateMapping = false;
      }
    })
  }

  goToNextStep(): void {
    this.horizontalStepper.next();
  }

  onStepChange(event: any) {
    if (event.selectedIndex === 0) {
      // this.addOrdersService.currentOrderDetailsAddedToReceipt = []
      // this.secondComponent.initialize();
    } else if (event.selectedIndex === 1) {
      // this.addOrdersService.currentOrderDetailsAddedToReceipt = []
      // this.mappingComponent.initialize();
    } else if (event.selectedIndex === 2) {
      // console.log(this.menuForm.value);
      // this.overviewComponent.initialize();
    }
  }
}
