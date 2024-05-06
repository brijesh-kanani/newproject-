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
import { ImportService } from '../import.service';
import { CustomerAccountService } from 'app/modules/customer-account/customer-account.service';
import { SharedService } from 'app/mock-api/common/shared.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ViewModelComponent } from './view-model/view-model.component';
import * as xml2js from 'xml2js';
import { SaveTamplateComponent } from '../input-mapping/save-tamplate/save-tamplate.component';

@Component({
  selector: 'app-input-file',
  templateUrl: './input-file.component.html',
  styleUrls: ['./input-file.component.scss'],
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
export class InputFileComponent {
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
  isOdeoMapping: boolean = false;
  odeoCheckbox: any
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
        "field": null,
        "filter": [],
        "multifield": "%%#FirstOrLast({Company},{Name})#%%",
      }
        , {
        "map_to": "Contact",
        "field": null,
        "filter": [],
        "multifield": "%%#LastOrNothing({Company},{Name})#%%",
      }
        , {
        "map_to": "Address1",
        "field": "Address1",
        "filter": []
      }
        , {
        "map_to": "Address2",
        "field": "Address2",
        "filter": []
      }
        , {
        "map_to": "Suburb",
        "field": "Suburb",
        "filter": []
      }
        , {
        "map_to": "State",
        "field": "State",
        "filter": [
          {
            "search": "Australian Capital Territory",
            "replace": "ACT",
            "searchType": "contains",
            "ignore_case": "true",
            "replace_whole_field": "true"
          },
          {
            "search": "New South Wales",
            "replace": "NSW",
            "searchType": "contains",
            "ignore_case": "true",
            "replace_whole_field": "true"
          },
          {
            "search": "Northern Territory",
            "replace": "NT",
            "searchType": "contains",
            "ignore_case": "true",
            "replace_whole_field": "true"
          },
          {
            "search": "Queensland",
            "replace": "QLD",
            "searchType": "contains",
            "ignore_case": "true",
            "replace_whole_field": "true"
          },
          {
            "search": "South Australia",
            "replace": "SA",
            "searchType": "contains",
            "ignore_case": "true",
            "replace_whole_field": "true"
          },
          {
            "search": "Tasmania",
            "replace": "TAS",
            "searchType": "contains",
            "ignore_case": "true",
            "replace_whole_field": "true"
          },
          {
            "search": "Victoria",
            "replace": "VIC",
            "searchType": "contains",
            "ignore_case": "true",
            "replace_whole_field": "true"
          },
          {
            "search": "Western Australia",
            "replace": "WA",
            "searchType": "contains",
            "ignore_case": "true",
            "replace_whole_field": "true"
          }
        ]

      }
        , {
        "map_to": "Postcode",
        "field": "Postcode",
        "filter": []
      }
        , {
        "map_to": "Country",
        "field": "Country",
        "filter": []
      }
        , {
        "map_to": "TelephoneNumber",
        "field": "TelephoneNumber",
        "filter": []
      }
        , {
        "map_to": "EmailAddress",
        "field": "EmailAddress",
        "filter": []
      }
        , {
        "map_to": "CustomerInstructions",
        "field": "CustomerInstructions",
        "filter": []
      }
        , {
        "map_to": "WarehouseInstructions",
        "field": "WarehouseInstructions",
        "filter": []
      }
        , {
        "map_to": "FreightInstructions",
        "field": null,
        "multifield": "%%{TelephoneNumber} {CustomerInstructions} {FreightInstructions}%%",
        "filter": []
      }
        , {
        "map_to": "SkuId",
        "field": "ProductCode",
        "filter": []
      }
        , {
        "map_to": "Quantity",
        "field": "Quantity",
        "filter": []
      }
        , {
        "map_to": "Description",
        "field": "SkuDescription",
        "filter": []
      }
        , {
        "map_to": "ProductType",
        "field": "",
        "filter": []
      }
        , {
        "map_to": "ImageLink",
        "field": "",
        "filter": []
      }
        , {
        "map_to": "SupplierId",
        "field": "",
        "filter": []
      }
        , {
        "map_to": "Length",
        "field": "",
        "filter": []
      }
        , {
        "map_to": "Width",
        "field": "",
        "filter": []
      }
        , {
        "map_to": "Height",
        "field": "",
        "filter": []
      }
        , {
        "map_to": "Weight",
        "field": "",
        "filter": []
      }
        , {
        "map_to": "PackingNotes",
        "field": "",
        "filter": []
      }
        , {
        "map_to": "CarrierServiceCode",
        "field": "CarrierServiceCode",
        "filter": []
      }
        , {
        "map_to": "IsAtlRequired",
        "field": "CarrierServiceCode",
        "filter": [
          {
            "search": "ATL",
            "replace": "true",
            "searchType": "contains",
            "ignore_case": "true",
            "replace_whole_field": "true"
          },
          {
            "search": "Authority to Leave",
            "replace": "true",
            "searchType": "contains",
            "ignore_case": "true",
            "replace_whole_field": "true"
          }
        ]
      }
        , {
        "map_to": "IsAtlRequired",
        "field": "CustomerInstructions",
        "filter": [
          {
            "search": "ATL",
            "replace": "true",
            "searchType": "contains",
            "ignore_case": "true",
            "replace_whole_field": "true"
          },
          {
            "search": "Authority to Leave",
            "replace": "true",
            "searchType": "contains",
            "ignore_case": "true",
            "replace_whole_field": "true"
          }
        ]
      }
        , {
        "map_to": "IsAtlRequired",
        "field": "FreightInstructions",
        "filter": [
          {
            "search": "ATL",
            "replace": "true",
            "searchType": "contains",
            "ignore_case": "true",
            "replace_whole_field": "true"
          },
          {
            "search": "Authority to Leave",
            "replace": "true",
            "searchType": "contains",
            "ignore_case": "true",
            "replace_whole_field": "true"
          }
        ]
      }
        , {
        "map_to": "LineReference1",
        "field": "OrderLineNumber",
        "filter": []
      }
        , {
        "map_to": "LineReference2",
        "field": "",
        "filter": []
      }
        , {
        "map_to": "LineReference3",
        "field": "",
        "filter": []
      }
        , {
        "map_to": "FullAddress",
        "field": null,
        "multifield": "%%{Address1},{Address2},{Suburb},{State},{Postcode},{Country}%%",
        "filter": [
          {
            "search": "Australian Capital Territory",
            "replace": "ACT",
            "searchType": "contains",
            "ignore_case": "true",
            "replace_whole_field": "true"
          },
          {
            "search": "New South Wales",
            "replace": "NSW",
            "searchType": "contains",
            "ignore_case": "true",
            "replace_whole_field": "true"
          },
          {
            "search": "Northern Territory",
            "replace": "NT",
            "searchType": "contains",
            "ignore_case": "true",
            "replace_whole_field": "true"
          },
          {
            "search": "Queensland",
            "replace": "QLD",
            "searchType": "contains",
            "ignore_case": "true",
            "replace_whole_field": "true"
          },
          {
            "search": "South Australia",
            "replace": "SA",
            "searchType": "contains",
            "ignore_case": "true",
            "replace_whole_field": "true"
          },
          {
            "search": "Tasmania",
            "replace": "TAS",
            "searchType": "contains",
            "ignore_case": "true",
            "replace_whole_field": "true"
          },
          {
            "search": "Victoria",
            "replace": "VIC",
            "searchType": "contains",
            "ignore_case": "true",
            "replace_whole_field": "true"
          },
          {
            "search": "Western Australia",
            "replace": "WA",
            "searchType": "contains",
            "ignore_case": "true",
            "replace_whole_field": "true"
          }
        ]
      }
        , {
        "map_to": "DeclaredValue",
        "field": "SubTotal",
        "filter": []
      }
        , {
        "map_to": "LineNotes",
        "field": "UnitPrice",
        "filter": []
      }
      ]
    }
  ]
  warehouseList: any = []
  // displayedColumns: any = ["select", "templateName", "actions"];
  displayedColumns: any = ["templateName", "actions"];
  constructor(private formBuilder: FormBuilder,
    public snack: MatSnackBar,
    private matDialog: MatDialog,
    public importService: ImportService,
    public customerService: CustomerAccountService,
    public _spinner: NgxSpinnerService,
    public sharedService: SharedService,
    public router: Router
  ) {
    this.snackBar = new SnackBar(snack);

  }

  ngOnInit(): void {
    this.importService.updateTempList.subscribe((data: any) => {
      if (data && data.length > 0) {
        // this.getTempleteList();
        this.warehouse = data[0].WarehouseId;
        this.getMappingList(data)
      }
    }
    )
    // new add mathod for warehouse
    this.getWarehouseByUser();
    // this.getTempleteList();
    const JsonDataChanges = this.horizontalStepperForm.get('step1.jsonData') as FormGroup;
    JsonDataChanges.valueChanges.subscribe((data) => {
      if (!data) {
        this.selectedFileName = '';
      }
    });
  }

  // ngOnDestroy(): void {
  //   let obj: any = { notCall: 1 }
  //   this.importService.updateTempList.next(obj)
  // }


  clearData() {
    this.selectedFileName = ''
    this.exelData = ''
    this.mappingData = [];
    this.horizontalStepperForm.get('step1').patchValue({ jsonData: '' });
  }

  getWarehouseByUser() {
    let data = this.customerService.editCrateUser;

    if (data) {
      this.customerService.getWarehouseByAccountNumber(data).then((res) => {
        if (res) {
          this.warehouseList = res;
        }
      }).catch((error) => {
        console.log(error, 'get warehouse error')
        this.snackBar.error(error.errorMessage)
      })
    }
  }

  public async onWarehouseSelectionChange(event: any) {
    this.clearData()
    this.importService.mappingWarehouseData = event.value
    this.getMappingList()
    // const selectedWarehouseId = event.value;
  }

  public async getMappingList(data?: any) {
    if (this.customerService.editCrateUser && this.customerService.editCrateUser.user) {
      let warehouseId: any

      if (data && data.length > 0) {
        warehouseId = data[0]?.WarehouseId || this.importService.mappingWarehouseData
      } else {
        warehouseId = this.importService.mappingWarehouseData
      }
      let body = { accountNumber: this.customerService.editCrateUser.user.AccountNumber, warehouseId: warehouseId }
      await this.customerService.getMapping(body).then((response: any) => {
        if (response && response.mappingAttributes) {
          this.mappingData = response.mappingAttributes
          this.customerService.mappingData = response.mapping
          this.horizontalStepperForm.get('step1').patchValue({ selectTemplete: response })
          this.horizontalStepperForm.get('step1').patchValue({ jsonData: this.odeoXmlJsonData })
          this.horizontalStepperForm.get('step1').patchValue({ isHeader: true })
        } else {
          this.horizontalStepperForm.get('step1').patchValue({ selectTemplete: [] })
          this.mappingData = response.mappingAttributes
          this.customerService.mappingData = response.mapping
        }
        if (response.mapping) {
          this.isOdeoMapping = false
          this.odeoCheckbox = false;
          this.templete = response.mapping;
        } else {
          this.isOdeoMapping = false
          this.odeoCheckbox = false;
          this.templete = []
        }
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
      await this.customerService.getMapping(body).then((response: any) => {
        if (response && response.mappingAttributes) {
          this.mappingData = response.mappingAttributes
          this.customerService.mappingData = response.mapping
          this.horizontalStepperForm.get('step1').patchValue({ selectTemplete: response })
          this.horizontalStepperForm.get('step1').patchValue({ jsonData: this.odeoXmlJsonData })
          this.horizontalStepperForm.get('step1').patchValue({ isHeader: true })
        } else {
          this.horizontalStepperForm.get('step1').patchValue({ selectTemplete: [] })
          this.mappingData = response.mappingAttributes
          this.customerService.mappingData = response.mapping
        }
        if (response.mapping) {
          this.isOdeoMapping = false
          this.odeoCheckbox = false;
          this.templete = response.mapping;
        } else {
          this.isOdeoMapping = false
          this.odeoCheckbox = false;
          this.templete = []
        }
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

  public async getTempleteList(data?: any) {
    this._spinner.show();
    const user = JSON.parse(localStorage.getItem('user'))
    if (this.customerService.editCrateUser && this.customerService.editCrateUser.user && user) {
      let body = { accountNumber: this.customerService.editCrateUser.user.AccountNumber, warehouseId: user.WareHouseId }
      await this.customerService.getMapping(body).then((response: any) => {
        if (response && response.mappingAttributes) {
          this.mappingData = response.mappingAttributes
          this.customerService.mappingData = response.mapping
          this.horizontalStepperForm.get('step1').patchValue({ selectTemplete: response })
          this.horizontalStepperForm.get('step1').patchValue({ jsonData: this.odeoXmlJsonData })
          this.horizontalStepperForm.get('step1').patchValue({ isHeader: true })
        } else {
          this.horizontalStepperForm.get('step1').patchValue({ selectTemplete: [] })
          this.mappingData = response.mappingAttributes
          this.customerService.mappingData = response.mapping
        }
        if (response.mapping) {
          this.isOdeoMapping = false
          this.odeoCheckbox = false;
          this.templete = response.mapping;
        } else {
          this.templete = []
        }
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

  // onCheckboxChange(selectedTemp: any): void {
  //   this.templete.forEach((temp: any) => {
  //     if (temp !== selectedTemp) {
  //       temp.checked = false;
  //     } else {
  //     }
  //   });
  //   if (selectedTemp.checked) {
  //     this.horizontalStepperForm.get('step1').patchValue({ selectTemplete: selectedTemp })
  //     this.importService.updateTempList.next(selectedTemp)
  //     this.horizontalStepperForm.get('step1').patchValue({
  //       isHeader: selectedTemp.isHeader
  //     })
  //     this.isChecked = selectedTemp.isHeader
  //   } else {
  //     this.horizontalStepperForm.get('step1').patchValue({ selectTemplete: '' })
  //     this.horizontalStepperForm.get('step1').patchValue({ isHeader: false })
  //     this.isChecked = false
  //   }
  // }

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
        this.importService.file = file
        this.selectedFileName = file.name;
        this.errorMessage = '';
        this.readFile(file);
      } else {
        this._spinner.hide();
        this.errorMessage = 'Invalid file type, Only Excel, CSV and Json files are allowed.';
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
        this.importService.file = file
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
    this.matDialogRef = this.matDialog.open(ViewModelComponent, {
      panelClass: 'view-templete-dialog',
      width: '100%',
      // minHeight: '40vh',
      data: { mapping: temp, odeoFlag: this.isOdeoMapping }
    })
  }

  async deleteTemplate(temp: any) {
    let confirmationMessage = `Are you sure you want to delete mapping?`;
    const yes = await this.sharedService.ask(confirmationMessage);
    if (!yes) {
      return;
    }
    this.customerService.deleteMapping(temp.id).then(res => {
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

  odeoMappingChange() {
    this.isOdeoMapping = !this.isOdeoMapping
    if (this.isOdeoMapping) {
      this.clearData();
      this.templete = this.odeoXmlJsonData
    } else {
      this.onWarehouseSelectionChangeafter(this.warehouse)
      // this.getTempleteList()
    }
  }

  async saveOdeoMapping() {
    let xmlData: any = `<mapping title="ODEO - Orders">
    <defaults trim="true"/>
    <columns>
    <column id="c_ref1" name="Reference1" required="true"/>
    <column id="c_ref2" name="Reference2"/>
    <column id="c_ref3" name="Reference3"/>
    <column id="c_orderlinenumber" name="OrderLineNumber"/>
    <column id="c_name" name="Name" required="true"/>
    <column id="c_comp" name="Company" required="true"/>
    <column id="c_addr1" name="Address1" required="true"/>
    <column id="c_addr2" name="Address2"/>
    <column id="c_suburb" name="Suburb" required="true" upperCase="true"/>
    <column id="c_state" name="State" required="true" upperCase="true" filter="state"/>
    <column id="c_pcode" name="Postcode" required="true" upperCase="true"/>
    <column id="c_country" name="Country" required="true" upperCase="true"/>
    <column id="c_phone" name="TelephoneNumber"/>
    <column id="c_email" name="EmailAddress"/>
    <column id="c_frnotes" name="FreightInstructions"/>
    <column id="c_cunotes" name="CustomerInstructions"/>
    <column id="c_whnotes" name="WarehouseInstructions"/>
    <column id="c_accsku" name="ProductCode" required="true" upperCase="true"/>
    <column id="c_qty" name="Quantity" required="true"/>
    <column id="c_descr" name="SkuDescription"/>
    <column id="c_carrier" name="CarrierServiceCode"/>
    <column id="c_value" name="SubTotal"/>
    <column id="c_unitprice" name="UnitPrice"/>
    <column id="c_atl" name="CarrierServiceCode" filter="atlfilter"/>
    <column id="c_atl" name="CustomerInstructions" filter="atlfilter"/>
    <column id="c_atl" name="FreightInstructions" filter="atlfilter"/>
    </columns>
    <fields>
    <field id="RowNumber" mapping="%%{@ROWNUMBER}%%" />
    <field id="Key" mapping="%%{c_ref1}%%" />
    <field id="Reference" mapping="%%{c_ref1}%%" />
    <field id="CustomerReference" mapping="%%{c_ref2}%%" />
    <field id="Reference3" mapping="%%{c_ref3}%%" />
    <field id="CustomerName" mapping="%%#FirstOrLast({c_comp},{c_name})#%%" />
    <field id="ContactName" mapping="%%#LastOrNothing({c_comp},{c_name})#%%" />
    <field id="PostalAddress1" mapping="%%{c_addr1}%%" />
    <field id="PostalAddress2" mapping="%%{c_addr2}%%" />
    <field id="PostalSuburb" mapping="%%{c_suburb}%%" />
    <field id="PostalState" mapping="%%{c_state}%%" />
    <field id="PostalPostalCode" mapping="%%{c_pcode}%%" />
    <field id="Country" mapping="%%{c_country}%%" />
    <field id="PhoneNumber" mapping="%%{c_phone}%%" />
    <field id="EmailAddress" mapping="%%{c_email}%%" />
    <field id="CustomerSpecialInstructions" mapping="%%{c_cunotes}%%" />
    <field id="WarehouseInstructions" mapping="%%{c_whnotes}%%" />
    <field id="FreightInstructions" mapping="%%{c_phone} {c_cunotes} {c_frnotes}%%" />
    <field id="AccountProductNumber" mapping="%%{c_accsku}%%" />
    <field id="Quantity" mapping="%%{c_qty}%%" />
    <field id="Description" mapping="%%{c_descr}%%" />
    <field id="ProductType" mapping="%%{c_type}%%" />
    <field id="ImageLink" mapping="%%{c_url}%%" />
    <field id="SupplierId" mapping="%%{c_supsku}%%" />
    <field id="Length" mapping="" />
    <field id="Width" mapping="" />
    <field id="Height" mapping="" />
    <field id="Weight" mapping="" />
    <field id="PackingNotes" mapping="" />
    <field id="FreightCarrierNames" mapping="%%{c_carrier}%%" />
    <field id="AuthorityToLeaveUnattended" mapping="%%{c_atl}%%" />
    <field id="LineReference1" mapping="%%{c_orderlinenumber}%%" />
    <field id="LineReference2" mapping="" />
    <field id="LineReference3" mapping="" />
    <field id="FullAddress" mapping="%%{c_addr1},{c_addr2},{c_suburb},{c_state},{c_pcode},{c_country}%%" />
    <field id="OrderDeclaredValue" mapping="%%{c_value}%%" />
    <field id="LineNotes" mapping="%%{c_unitprice}%%" />

</fields>
    <filters>
    <filter id="atlfilter">
    <items>
    <item search="ATL" replace="true" searchType="contains" ignoreCase="true" replaceWholeField="true"/>
    <item search="Authority to Leave" replace="true" searchType="contains" ignoreCase="true" replaceWholeField="true"/>
    </items>
    </filter>
    <filter id="state">
    <items>
    <item search="Australian Capital Territory" replace="ACT" searchType="contains" ignoreCase="true" replaceWholeField="true"/>
    <item search="New South Wales" replace="NSW" searchType="contains" ignoreCase="true" replaceWholeField="true"/>
    <item search="Northern Territory" replace="NT" searchType="contains" ignoreCase="true" replaceWholeField="true"/>
    <item search="Queensland" replace="QLD" searchType="contains" ignoreCase="true" replaceWholeField="true"/>
    <item search="South Australia" replace="SA" searchType="contains" ignoreCase="true" replaceWholeField="true"/>
    <item search="Tasmania" replace="TAS" searchType="contains" ignoreCase="true" replaceWholeField="true"/>
    <item search="Victoria" replace="VIC" searchType="contains" ignoreCase="true" replaceWholeField="true"/>
    <item search="Western Australia" replace="WA" searchType="contains" ignoreCase="true" replaceWholeField="true"/>
    </items>
    </filter>
    </filters>
    </mapping>`

    const blob = new Blob([xmlData], { type: 'application/xml' });
    const matDialogRef = this.matDialog.open(SaveTamplateComponent, {
      panelClass: 'create-templete-dialog',
      width: '40vw',
      maxWidth: '40vw',
      data: { fileData: blob, fileType: 'odeoFile' },
    })
    matDialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.importService.updateTempList.next(res)
      }
    })
    // let user: any = JSON.parse(localStorage.getItem('user'))
    // if (this.customerService.editCrateUser && this.customerService.editCrateUser.user && user) {

    //   let accountData: any = this.customerService.editCrateUser.user
    //   const formData = new FormData()
    //   formData.append('accountNumber', accountData.AccountNumber);
    //   formData.append('warehouseId', user.WareHouseId);
    //   formData.append('file', blob);

    //   if (this.customerService.mappingData && this.customerService.mappingData.length > 0 && this.customerService.mappingData[0].id) {
    //     await this.customerService.deleteMapping(this.customerService.mappingData[0].id).then((response: any) => {
    //       if (response) {
    //       }
    //     }).catch((e) => {
    //       this.snackBar.error('error while updating mapping');
    //     });
    //   }
    //   this.customerService.createMapping(formData).then(res => {
    //     if (res) {
    //       this.snackBar.success(res.message);
    //       this.importService.updateTempList.next(res)
    //       this._spinner.hide()
    //       this.matDialogRef.close(res)
    //       // this.router.navigate(['/accounts'])
    //     }
    //   }).catch((err: any) => {
    //     this._spinner.hide()
    //     this.snackBar.error(err.error.errorMessage);
    //   });
    // } else {
    //   this.snackBar.error('User data not found. Please try to refresh with F5');
    // }
  }

}
