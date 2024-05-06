import { Component, Inject, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, FormsModule, PatternValidator, ReactiveFormsModule, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogContent, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { delay, map, startWith } from 'rxjs/operators';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import * as moment from 'moment';
import { MatIconModule } from '@angular/material/icon';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackBar } from 'app/layout/common/snack-bar/snack-bar.class';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { NgIf } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { WorkSheet, read, utils } from 'xlsx';
import { MatStepperModule } from '@angular/material/stepper';
import { CustomerAccountService } from 'app/modules/customer-account/customer-account.service';
import { SharedService } from 'app/mock-api/common/shared.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import * as xml2js from 'xml2js';
import { ReceivingService } from '../receiving.service';
import { ViewReceivingMappingComponent } from './view-receiving-mapping/view-receiving-mapping.component';


@Component({
  selector: 'app-view-import-mapping',
  templateUrl: './view-import-mapping.component.html',
  styleUrls: ['./view-import-mapping.component.scss'],
  standalone: true,
  imports: [
    MatDialogModule,
    CommonModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatRadioModule,
    MatSelectModule,
    MatIconModule,
    MatSnackBarModule,
    MatCardModule,
    RouterLink,
    NgIf,
    MatTableModule,
    MatStepperModule,
    MatCheckboxModule
  ],
})
export class ViewImportMappingComponent {
  @Input() horizontalStepperForm!: UntypedFormGroup;
  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedFileName: string = '';
  errorMessage: string = '';
  searchctrl = new FormControl();
  searchTempctrl = new FormControl();
  snackBar: SnackBar;
  warehouseFilter: any;
  templateFilter: any;
  warehouse: any;
  templete: any = [];
  exelData: any
  selectedTemp: number;
  isChecked: boolean;
  mappingData: any;
  matDialogRef: any;
  mappingTypeList: any = []

  receiverFtpList: any = []
  odeoXmlJsonData: any = [
    {
      "id": "ODEO-Mapping",
      "mappingAttributes": [{
        "map_to": "Key",
        "field": "Reference1",
        "filter": []
      }, {
        "map_to": "Reference1",
        "field": "Reference1",
        "filter": []
      }
        , {
        "map_to": "Reference2",
        "field": "Reference2",
        "filter": []
      }
        , {
        "map_to": "Reference3",
        "field": "Reference3",
        "filter": []
      }
        , {
        "map_to": "Name",
        "field": "Company,Name",
        "filter": []
      }]
    }
  ]
  // displayedColumns: any = ["select", "templateName", "actions"];
  displayedColumns: any = ["templateName", "actions"];
  constructor(private formBuilder: FormBuilder,
    public snack: MatSnackBar,
    private matDialog: MatDialog,
    public receivingService: ReceivingService,
    public customerService: CustomerAccountService,
    public _spinner: NgxSpinnerService,
    public sharedService: SharedService,
    public router: Router
  ) {
    this.snackBar = new SnackBar(snack);

  }

  ngOnInit(): void {
    this.customerService.ftpAccountListData.subscribe((response: any) => {
      if (response) {
        this.receiverFtpList = response;
        this.receivingService.ftpAccountListData = response
      }
    })

    this.receivingService.updateTempList.subscribe((data: any) => {
      if (data && data.length > 0) {
        this.getMappingList()
      }
    }
    )

    this.getReceiverMappingType()
    const JsonDataChanges = this.horizontalStepperForm.get('step1.jsonData') as FormGroup;
    JsonDataChanges.valueChanges.subscribe((data) => {
      if (!data) {
        this.selectedFileName = '';
      }
    });
  }

  ngOnDestroy(): void {
    let obj: any = { notCall: 1 }
    this.receivingService.updateTempList.next(obj)
    this.receivingService.mappingTypesData = '';
    this.receivingService.mappingFtpAccountData = '';
  }

  public async onreceiverMapTypeSelectionChange(event: any) {
    this.clearData()
    this.receivingService.mappingTypesData = event.value;
    if (this.receivingService.mappingFtpAccountData && this.receivingService.mappingTypesData) {
      this.getMappingList()
    }
  }


  getReceiverMappingType() {
    this.customerService.getReceiverMappingType().then((res) => {
      if (res) {
        this.mappingTypeList = res.data
        this.receivingService.mappingTypes = this.mappingTypeList;
      }
    }).catch((error) => {
      console.log(error, 'mapping Type Not Found')
      // this.snackBar.error(error.errorMessage)
    })
  }

  clearData() {
    this.selectedFileName = ''
    this.exelData = ''
    this.mappingData = [];
    this.horizontalStepperForm.get('step1').patchValue({ jsonData: '' });
  }

  public async onreceiverFtpSelectionChange(event: any) {
    this.clearData()
    this.receivingService.mappingFtpAccountData = event.value
    if (this.receivingService.mappingFtpAccountData && this.receivingService.mappingTypesData) {
      this.getMappingList()
    }
    // const selectedWarehouseId = event.value;
  }

  public async getMappingList(data?: any) {
    this._spinner.show();
    if (this.customerService.editCrateUser && this.customerService.editCrateUser.user) {
      let ftpAccountId: any
      ftpAccountId = this.receivingService.mappingFtpAccountData
      let body = { accountNumber: this.customerService.editCrateUser.user.AccountNumber, ftpAccountId: ftpAccountId, mapType: this.receivingService.mappingTypesData }
      await this.customerService.getMappingByFtp(body).then((response: any) => {
        if (response && response.data && response.data[0]) {
          if (response.data[0].mappingDetails && response.data[0].mappingDetails.mappingLineDetails) {
            this.mappingData = response.data[0].mappingDetails.mappingLineDetails
            this.customerService.ftpMappingData = response.data[0]
            this.horizontalStepperForm.get('step1').patchValue({ selectTemplete: response })
            this.horizontalStepperForm.get('step1').patchValue({ jsonData: this.odeoXmlJsonData })
            this.horizontalStepperForm.get('step1').patchValue({ isHeader: true })
            this.templete = response.data;

          } else {
            this.templete = []
            this.horizontalStepperForm.get('step1').patchValue({ selectTemplete: [] })
            this.mappingData = []
            this.customerService.ftpMappingData = response.data[0]
          }
        } else {
          this.templete = []
          this.mappingData = []
        }
        // if (response.data) {
        //   // this.isOdeoMapping = false
        //   // this.odeoCheckbox = false;
        //   this.templete = response.data;
        // } else {

        // }
        this._spinner.hide();
      }).catch(error => {
        this.snackBar.error(error.message)
      });
      this._spinner.hide();
    } else {
      this._spinner.hide();
      this.router.navigate(['/accounts'])
    }
  }


  public async onWarehouseSelectionChangeafter(warehouse: any) {
    if (this.customerService.editCrateUser && this.customerService.editCrateUser.user) {
      let body = { accountNumber: this.customerService.editCrateUser.user.AccountNumber, warehouseId: warehouse }
      // await this.customerService.getMapping(body).then((response: any) => {
      //   if (response && response.mappingAttributes) {
      //     this.mappingData = response.mappingAttributes
      //     this.customerService.mappingData = response.mapping
      //     this.horizontalStepperForm.get('step1').patchValue({ selectTemplete: response })
      //     // this.horizontalStepperForm.get('step1').patchValue({ jsonData: this.odeoXmlJsonData })
      //     this.horizontalStepperForm.get('step1').patchValue({ isHeader: true })
      //   } else {
      //     this.horizontalStepperForm.get('step1').patchValue({ selectTemplete: [] })
      //     this.mappingData = response.mappingAttributes
      //     this.customerService.mappingData = response.mapping
      //   }
      //   if (response.mapping) {
      //     // this.isOdeoMapping = false
      //     // this.odeoCheckbox = false;
      //     this.templete = response.mapping;
      //   } else {
      //     this.templete = []
      //   }
      //   this._spinner.hide();
      // }).catch(error => {
      //   this.snackBar.error(error.message)
      // });
      // this._spinner.hide();
    } else {
      this._spinner.hide();
      this.router.navigate(['/accounts'])
    }
  }

  public async getTempleteList(data?: any) {
    this._spinner.show();
    const user = JSON.parse(localStorage.getItem('user'))
    // if (this.customerService.editCrateUser && this.customerService.editCrateUser.user && user) {
    //   let body = { accountNumber: this.customerService.editCrateUser.user.AccountNumber, warehouseId: user.WareHouseId }
    //   await this.customerService.getMapping(body).then((response: any) => {
    //     if (response && response.mappingAttributes) {
    //       this.mappingData = response.mappingAttributes
    //       this.customerService.mappingData = response.mapping
    //       this.horizontalStepperForm.get('step1').patchValue({ selectTemplete: response })
    //       // this.horizontalStepperForm.get('step1').patchValue({ jsonData: this.odeoXmlJsonData })
    //       this.horizontalStepperForm.get('step1').patchValue({ isHeader: true })
    //     } else {
    //       this.horizontalStepperForm.get('step1').patchValue({ selectTemplete: [] })
    //       this.mappingData = response.mappingAttributes
    //       this.customerService.mappingData = response.mapping
    //     }
    //     if (response.mapping) {
    //       // this.isOdeoMapping = false
    //       // this.odeoCheckbox = false;
    //       this.templete = response.mapping;
    //     } else {
    //       this.templete = []
    //     }
    //     this._spinner.hide();
    //   }).catch(error => {
    //     this.snackBar.error(error.message)
    //   });
    //   this._spinner.hide();
    // } else {
    //   this._spinner.hide();
    //   this.router.navigate(['/accounts'])
    // }

  }

  // private _filterTemplete(name: string): OrderTemplate[] {
  //   const filterValue = name.toLowerCase();
  //   return this.templete.filter((option: any) => option.name.toLowerCase().includes(filterValue.toLowerCase()));
  // }

  private _filter(name: string): any {
    const filterValue = name.toLowerCase();
    return this.warehouse.filter((option: any) => option.name.toLowerCase().includes(filterValue.toLowerCase()));
  }

  // public setWarehouse() {
  //   // this.importOrderService.warehouse = this.warehouseForm.value.selectWarehouse
  //   this.getTempleteList('')
  // }

  public setTemplete() {
    // this.importService.templete = this.warehouseForm.value.selectTemplete
  }


  handleFileInput(event: any) {
    this._spinner.show();
    const file: File = event.target.files[0];
    setTimeout(() => {
      if (this.validateFile(file)) {
        this.receivingService.file = file
        this.selectedFileName = file.name;
        this.errorMessage = '';
        this.readFile(file);
      } else {
        this._spinner.hide();
        this.errorMessage = 'Invalid file type. Only Excel and Json files are allowed.';
      }
      this.fileInput.nativeElement.value = '';
      // this._spinner.hide();
    }, 100);
  }

  handleFileDrop(event: DragEvent) {
    this._spinner.show();
    event.preventDefault();
    const file: any = event.dataTransfer?.files[0];

    setTimeout(() => {
      if (this.validateFile(file)) {
        this.receivingService.file = file
        this.selectedFileName = file.name;
        this.errorMessage = '';
        this.readFile(file);
      } else {
        this._spinner.hide();
        this.errorMessage = 'Invalid file type. Only Excel files are allowed.';
      }
      this._spinner.hide();
    }, 100);
  }

  checkIsHeaderOrNot(json: any[][]): boolean {
    const hasHeaders = json[0].every(value => typeof value === 'string')
    return hasHeaders;
  }


  // createJsonFile(worksheet: any) {
  //   const jsonData: any[][] = [];

  //   // Get the range of the worksheet
  //   const range = utils.decode_range(worksheet['!ref']);

  //   // Loop through the rows
  //   for (let row = range.s.r; row <= 2; ++row) {
  //     const rowData: any[] = [];

  //     // Loop through the columns
  //     for (let col = range.s.c; col <= range.e.c; ++col) {
  //       const cellAddress = { c: col, r: row };
  //       const cellRef = utils.encode_cell(cellAddress);

  //       // Check if the cell exists in the worksheet
  //       if (worksheet[cellRef]) {
  //         const cellValue = worksheet[cellRef].v;
  //         rowData.push(cellValue);
  //       } else {
  //         rowData.push(null);
  //       }
  //     }

  //     jsonData.push(rowData);
  //   }

  //   return jsonData;
  // }

  createJsonFile(worksheet: any) {
    const jsonData: any[][] = [];

    // Get the range of the worksheet
    const range = utils.decode_range(worksheet['!ref']);

    // Loop through the rows
    for (let row = range.s.r; row <= 1; ++row) {
      const rowData: any[] = [];

      // Loop through the columns
      for (let col = range.s.c; col <= range.e.c; ++col) {
        const cellAddress = { c: col, r: row };
        const cellRef = utils.encode_cell(cellAddress);

        // Check if the cell exists in the worksheet
        if (worksheet[cellRef]) {
          const cellValue = worksheet[cellRef].v;
          rowData.push(cellValue);
        } else {
          rowData.push(null);
        }
      }

      // Remove trailing empty columns
      while (rowData.length > 0 && rowData[rowData.length - 1] === null) {
        rowData.pop();
      }

      jsonData.push(rowData);
    }

    return jsonData;
  }

  convertJsonToParse(data: any): any {
    return JSON.parse(data);
  }

  readFile(file: File) {
    try {
      if (file) {
        // setTimeout(() => {
        let headerFlag = false;
        const fileReader: FileReader = new FileReader();
        fileReader.onload = async (e: any) => {

          this.horizontalStepperForm.get('step1').patchValue({
            isHeader: false
          })

          if (file.type === 'application/json') {
            try {
              // If parsing is successful, jsonData contains the parsed data
              // and you can proceed with using it.
              const jsonData = JSON.parse(e.target.result);
              let body = [{
                type: 'json',
                jsonData: jsonData
              }]
              this.horizontalStepperForm.get('step1').patchValue({ jsonData: body });
              this.exelData = JSON.parse(e.target.result)
              headerFlag = true
            } catch (error) {
              this.snackBar.error("Invalid JSON")
              this.horizontalStepperForm.get('step1').patchValue({ jsonData: '' });
            }

          } else {
            const workbook = read(e.target.result, { type: 'binary' });
            const worksheet: WorkSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = this.createJsonFile(worksheet)

            // const jsonData: any[][] = utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
            for (let columnIndex = jsonData[0].length - 1; columnIndex >= 0; columnIndex--) {
              // Check if all values in the column are empty
              const columnIsEmpty = jsonData.every(row => !row[columnIndex]);
              // If the column is empty, remove it from the data
              if (columnIsEmpty && this.horizontalStepperForm.get('step1').value.isHeader) {
                jsonData.forEach(row => row.splice(columnIndex, 1));
              }
            }
            headerFlag = await this.checkIsHeaderOrNot(jsonData);
            let body = [{
              type: 'csv',
              jsonData: jsonData
            }]
            this.exelData = jsonData
            this.horizontalStepperForm.get('step1').patchValue({ jsonData: body });

          }

          this.isChecked = true;
          if (this.mappingData && this.mappingData.length > 0) {
            this.horizontalStepperForm.get('step1').patchValue({ selectTemplete: this.mappingData })
          } else {
            this.horizontalStepperForm.get('step1').patchValue({ selectTemplete: '' })
          }
          this.horizontalStepperForm.get('step1').patchValue({
            isHeader: headerFlag
          })
        };
        // Read file as text if JSON, otherwise as binary string for Excel/CSV
        if (file.type === 'application/json') {
          fileReader.readAsText(file);
        } else {
          fileReader.readAsBinaryString(file);
        }
        // }, 100)
      }
    } catch (err) {
      console.log(err)
    }

  }
  validateFile(file: File): boolean {
    const validFileTypes: string[] = [
      'application/vnd.ms-excel', // XLS
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
      'text/csv', // CSV
      'application/json' // JSON
    ];
    return file && validFileTypes.includes(file.type);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    const dropZone = document.getElementById('drop-zone');
    dropZone?.classList.add('drag-over');
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    const dropZone = document.getElementById('drop-zone');
    dropZone?.classList.remove('drag-over');
  }

  viewModelOpen(temp: any) {
    this.matDialogRef = this.matDialog.open(ViewReceivingMappingComponent, {
      panelClass: 'view-templete-dialog',
      width: '100%',
      // minHeight: '40vh',
      data: { mapping: temp, odeoFlag: false, horizontalStepperForm: this.horizontalStepperForm }
    })
  }

  async deleteTemplate(temp: any) {
    let confirmationMessage = `Are you sure you want to delete mapping?`;
    const yes = await this.sharedService.ask(confirmationMessage);
    if (!yes) {
      return;
    }
    this.customerService.deleteFtpMapping(temp.mappingDetails.ftpMappingId).then(res => {
      if (res) {
        this.horizontalStepperForm.get('step1').patchValue({ isHeader: this.isChecked });
        this.clearData()
        // this.getTempleteList(res)
        this.getMappingList()
        this.snackBar.success(res.message)
      } else {
        this.snackBar.error(res.message)
      }
    })
  }


}
