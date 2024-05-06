import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ReceivingService } from './receiving.service';
import { ViewImportMappingComponent } from './view-import-mapping/view-import-mapping.component';
import { CreateUpdateMappingComponent } from './create-update-mapping/create-update-mapping.component';
import { fuseAnimations } from '@fuse/animations';
import { NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-receiving-mapping',
  templateUrl: './receiving-mapping.component.html',
  styleUrls: ['./receiving-mapping.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  standalone: true,
  imports: [MatIconModule, FormsModule, ReactiveFormsModule, MatStepperModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatButtonModule, MatCheckboxModule, MatRadioModule, NgIf, MatTabsModule, ViewImportMappingComponent, CreateUpdateMappingComponent],
})
export class ReceivingMappingComponent {
  horizontalStepperForm: UntypedFormGroup;
  verticalStepperForm: UntypedFormGroup;
  updateMapping: boolean = false
  @ViewChild('horizontalStepper') horizontalStepper: MatStepper;
  @ViewChild('stepper') stepper: MatStepper;
  // @ViewChild(ViewImportMappingComponent) overviewComponent: ViewImportMappingComponent;
  // @ViewChild(CreateUpdateMappingComponent) mappingComponent: CreateUpdateMappingComponent;
  /**
   * Constructor
   */
  constructor(private _formBuilder: UntypedFormBuilder, public deviceService: DeviceDetectorService, private receivingService: ReceivingService) {
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

    this.receivingService.nextStepEvent.subscribe(() => {
      this.goToNextStep();
    });

    const TemplateChanges = this.horizontalStepperForm.get('step1.selectTemplete') as FormGroup;
    TemplateChanges.valueChanges.subscribe(data => {
      if (data.data && data.data[0] && data.data[0].mappingDetails && data.data[0].mappingDetails.mappingLineDetails &&  data.data[0].mappingDetails.mappingLineDetails.length > 0) {
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
