
import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, UntypedFormGroup, Validators, FormsModule } from '@angular/forms';
import { WorkSheet, read, utils } from 'xlsx';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SnackBar } from 'app/layout/common/snack-bar/snack-bar.class';
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
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { ImportService } from '../import.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SaveTamplateComponent } from './save-tamplate/save-tamplate.component';
import { Observable } from 'rxjs';
import { MappingFilterDialogComponent } from './mapping-filter-dialog/mapping-filter-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MultipleMappingDialogComponent } from './multiple-mapping-dialog/multiple-mapping-dialog.component';


interface ExcelData {
    [key: string]: any;
}


@Component({
    selector: 'app-input-mapping',
    templateUrl: './input-mapping.component.html',
    styleUrls: ['./input-mapping.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [CommonModule, MatIconModule, MatStepperModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatButtonModule, MatCheckboxModule, MatRadioModule, FormsModule, MatCardModule, MatSnackBarModule, MatPaginatorModule, MatTableModule, MatDialogModule, MatTooltipModule],
})

export class InputMappingComponent implements OnInit {
    @Input() horizontalStepperForm!: UntypedFormGroup;
    @Input() horizontalStepper: MatStepper;
    // @ViewChild('horizontalStepper') horizontalStepper!: MatStepper;
    @Output() selectedHeader = new EventEmitter<any>();
    @ViewChild('fileInput') fileInput!: ElementRef;
    // @ViewChild(MatPaginator) paginator!: MatPaginator;
    // @ViewChild(MatSort) sort: MatSort;
    @ViewChild('stepper') stepper: MatStepper;
    selectedFileName: string = '';
    errorMessage: string = '';
    isVisible: boolean = false;
    isErrorVisible: boolean = true;
    excelData: ExcelData[] = [];
    updateOrderArray: ExcelData[] = [];
    public orderCurrentlyAdding?: any;
    columns: any;
    // addSaveArray: any = ['ConsignmentID', 'ArticleActualCharge', 'ManualHandlingSurchargeAmount', 'SecurityManagementSurchargeAmount', 'FuelSurchargeAmount', 'ConsignmentDateCreated', 'ArticleNo'];
    // requiredArray: any = ['ConsignmentID', 'ArticleActualCharge', 'ManualHandlingSurchargeAmount', 'SecurityManagementSurchargeAmount', 'FuelSurchargeAmount', 'ConsignmentDateCreated', 'ArticleNo'];
    selectedOptions: any;
    snackBar: SnackBar;
    idUser: number;
    options = [
        { name: 'Customer Name', value: 'CustomerName', type: 'any' },
        { name: 'Contact Name', value: 'ContactName', type: 'any' },
        { name: 'Phone Number', value: 'PhoneNumber', type: 'number' },
        { name: 'Email', value: 'EmailAddress', type: 'any' },
        { name: 'Country', value: 'Country', type: 'any' },
        { name: 'Address1', value: 'PostalAddress1', type: 'any' },
        { name: 'Address2', value: 'PostalAddress2', type: 'any' },
        { name: 'Post Code', value: 'PostalPostalCode', type: 'number' },
        { name: 'State', value: 'PostalState', type: 'any' },
        { name: 'City', value: 'PostalSuburb', type: 'any' },
        { name: 'SKU', value: 'AccountProductNumber', type: 'any' },
        { name: 'Product Quantity', value: 'Quantity', type: 'number' },
        { name: 'Packing Notes', value: 'PackingNotes', type: 'any' },
        { name: 'Product Type', value: 'ProductType', type: 'any' },
        { name: 'Weight', value: 'NetWeight', type: 'number' },
        { name: 'Description', value: 'Description', type: 'any' },
        { name: 'Length', value: 'Length', type: 'number' },
        { name: 'Width', value: 'Width', type: 'number' },
        { name: 'Height', value: 'Height', type: 'number' },
        // { name: 'Freight Carrier', value: 'freightCarrier', type: 'any' },
        { name: 'Reference', value: 'Reference', type: 'any' },
        { name: 'Customer Reference', value: 'CustomerReference', type: 'any' },
        { name: 'Reference3', value: 'Reference3', type: 'any' },
        { name: 'Requisition Notes', value: 'RequisitionNotes', type: 'any' },
        { name: 'Order Instructions', value: 'OrderInstructions', type: 'any' },
        { name: 'Customer Special Instructions', value: 'CustomerSpecialInstructions', type: 'any' },
        { name: 'Freight Instructions', value: 'FreightInstructions', type: 'any' },
        { name: 'Order Declared Value', value: 'OrderDeclaredValue', type: 'number' },
        { name: 'Authority To Leave Unattended', value: 'AuthorityToLeaveUnattended', type: 'boolean' },
        { name: 'Set Order On Hold', value: 'SetOrderOnHold', type: 'boolean' },
        { name: 'is Domestic', value: 'isDomestic', type: 'boolean' },
        { name: 'Line Notes', value: 'LineNotes', type: 'any' },
        { name: 'Freight Special Instructions', value: 'FreightSpecialInstructions', type: 'any' },
        { name: 'Internal Notes', value: 'InternalNotes', type: 'any' },
        { name: 'Freight Carrier Name', value: 'FreightCarrierName', type: 'any' },
        { name: 'Consignment Number', value: 'ConsignmentNumber', type: 'any' }
    ]
    displayedColumns: string[] = [];
    extraDisplayedColumns: string[] = [];
    extraConditionalOptions: string[] = [];
    addedColumns: string[] = [];
    columnArray: any;
    ExtraColumnArray: any;
    jsonData: any
    dataSource: MatTableDataSource<ExcelData>;
    matDialogRef: any;
    isHeader: boolean = false
    updateTxtBtn: boolean = false;
    apiNotCall: boolean = true;
    headerLength: number = 0;
    tableData: any = [];
    searchedOptions: string[] = [];

    // Create an array of FormControl for each select column
    searchCtrlColumns: FormControl[] = [];

    filteredOptions: any = [];
    isHeaderEditMode = false;
    editedHeaders: string[] = [];
    tempData: any

    constructor(
        public snack: MatSnackBar,
        private matDialog: MatDialog,
        // @Inject(MAT_DIALOG_DATA) private _data: any,
        private router: Router,
        private importService: ImportService,
        private _spinner: NgxSpinnerService,
    ) {
        this.snackBar = new SnackBar(snack);
        this.selectedOptions = new Array(this.options.length).fill(null);
        // this.dataSource = new MatTableDataSource<ExcelData>(this.excelData);
        this.tableData = [];
        this.options.sort(function (a, b) {
            var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase()
            if (nameA < nameB) //sort string ascending
                return -1
            if (nameA > nameB)
                return 1
            return 0 //default return value (no sorting)
        })
    }

    ngOnInit(): void {
        const JsonDataChanges = this.horizontalStepperForm.get('step1.jsonData') as FormGroup;
        JsonDataChanges.valueChanges.subscribe((data) => {
            this._spinner.show();
            setTimeout(() => {
                this.isHeader = this.horizontalStepperForm.get('step1.isHeader').value
                this.selectedOptions = new Array(this.options.length).fill(null);
                // this.columnArray = this.importOrderService.templete;
                this.columns = [];
                this.displayedColumns = [];
                this.extraDisplayedColumns = [];
                this.extraConditionalOptions = [];
                this.addedColumns = [];
                this.setData(data)
                this._spinner.hide();
            }, 100)

        });
        const TemplateChanges = this.horizontalStepperForm.get('step1.selectTemplete') as FormGroup;
        TemplateChanges.valueChanges.subscribe(data => {
            this._spinner.show();
            setTimeout(() => {
                if (data.mappingAttributes && data.mappingAttributes.length > 0) {
                    this.updateTxtBtn = true
                } else {
                    this.updateTxtBtn = false
                }
                this.selectedOptions = new Array(this.options.length).fill(null);
                this.tempData = data
                this.importService.templete = data.mappingAttributes;
                this.displayedColumns = [];
                this.extraDisplayedColumns = [];
                this.extraConditionalOptions = [];
                this.addedColumns = [];
                this.columnArray = data.mappingAttributes;
                if (data.mappingAttributes && this.jsonData && this.apiNotCall) {
                    this.setData(this.jsonData)
                }
                this.apiNotCall = true
                setTimeout(() => {
                    this._spinner.hide();
                }, 100)
            }, 100)
        })
        const HeaderChanges = this.horizontalStepperForm.get('step1.isHeader') as FormGroup;
        HeaderChanges.valueChanges.subscribe(data => {
            this._spinner.show();
            setTimeout(() => {
                this.isHeader = data;
                this.displayedColumns = [];
                this.extraDisplayedColumns = [];
                this.extraConditionalOptions = [];
                this.addedColumns = [];
                this.selectedOptions = new Array(this.options.length).fill(null);
                if (this.jsonData) {
                    this.setData(this.jsonData)
                }
                setTimeout(() => {
                    this._spinner.hide();
                }, 100)
            }, 100)
        })

    }


    filterColumns(index: number): void {
        const searchTerm = this.searchedOptions[index].toLowerCase();
        this.filteredOptions[index] = this.options.filter(option => option.name.toLowerCase().includes(searchTerm));
    }

    resetData(index: number) {
        this.filteredOptions[index] = this.options
    }

    // setPaginatort(e: any) {
    //     const startIndex = e.pageIndex * e.pageSize;
    //     const endIndex = startIndex + e.pageSize;
    //     this.tableData = this.excelData.slice(startIndex, endIndex);
    // }

    initialize() {
        // setTimeout(() => {
        //     this.dataSource.paginator = this.paginator;
        //     this.dataSource.sort = this.sort;
        //     this.paginator.pageSize = 20;
        //     let obj = {
        //         "previousPageIndex": 0,
        //         "pageIndex": this.paginator?.pageIndex || 0,
        //         "pageSize": this.paginator?.pageSize || 20,
        //         "length": this.paginator?.length || this.excelData.length
        //     }
        //     this.setPaginatort(obj)

        // }, 0)
    }

    setColumn(event: any, selectedIndex: number): void {
        this.columns.map((data: any, index: number) => {
            if (index == selectedIndex) {
                this.columns.map((data: any) => {
                    if (data.selectedOption === event.value) {
                        data.selectedOption = '';
                    }
                })
                data.selectedOption = event.value
            }
        })
        const selectedValue = event.value;
        // Clear the selected option in other dropdowns
        for (let i = 0; i < this.selectedOptions.length; i++) {
            if (i !== selectedIndex && this.selectedOptions[i] === selectedValue) {
                this.selectedOptions[i] = null;
                this.columns[i].filter = []
            }
        }

        this.filteredOptions = new Array(this.displayedColumns.length).fill(this.options);
        this.searchedOptions = new Array(this.displayedColumns.length).fill('');

    }

    checkObjectLengthEquality(arr: any[][]): boolean {
        if (!Array.isArray(arr) || arr.length === 0) {
            return false; // Handle invalid input or empty array
        }
        const firstObjectLength = arr[0].length;
        for (let i = 1; i < arr.length; i++) {
            if (arr[i].length !== firstObjectLength) {
                return false;
            }
        }
        return true;
    }

    extractData(jsonData: any[][], headerIncludeFlag: boolean): ExcelData[] {
        let headers: any = [];
        if (headerIncludeFlag && jsonData.length > 0) {
            headers = jsonData.shift();
        } else {
            jsonData.length > 0 && jsonData[0].map((item: any, index: number) => {
                headers.push(index.toString())
            })
        }
        const excelData: ExcelData[] = [];
        const array: any = [];
        if (headers) {
            const stringArray = headers.map((element: any) => (element).toString());
            this.displayedColumns = stringArray;
            this.extraDisplayedColumns = headers.map((element: any) => (element).toString());
            this.extraConditionalOptions = headers.map((element: any) => (element).toString());
            for (const row of jsonData) {
                const rowData: ExcelData = {};
                for (let i = 0; i < headers.length; i++) {
                    const header = headers[i];
                    rowData[header] = row[i];
                }
                excelData.push(rowData);
                array.push(rowData);
            }
        }
        this.updateOrderArray = array;
        // setTimeout(() => {
        //     if (this.paginator) {
        //         this.paginator.pageSize = 20;
        //         this.paginator.pageIndex = 0;
        //     }
        //     this.dataSource.paginator = this.paginator;
        //     this.dataSource.sort = this.sort;
        // }, 1000)

        // this.dataSource = new MatTableDataSource<any>(excelData);

        // this.tableData = this.excelData.slice(0, 10);

        return excelData;
    }

    public async saveTemplate(): Promise<any> {
        this.matDialogRef = this.matDialog.open(SaveTamplateComponent, {
            panelClass: 'create-templete-dialog',
            width: '40vw',
            maxWidth: '40vw',
            data: {
                templeteData: this.importService.templete,
                columns: this.columns,
                templateForm: this.horizontalStepperForm.get('step1').value,
                tempData: this.tempData
            }
        })
        this.matDialogRef.afterClosed().subscribe((res: any) => {
            if (res) {
                let body = [res]
                // this.importService.updateTempList.next(body)
            }
        })
    }

    extractKeys(data: any): string[] {
        let keys: string[] = [];

        // Check if data is not an array and wrap it in an array if it's an object
        if (!Array.isArray(data)) {
            data = [data]; // Wrap the object in an array
        }

        function recurse(obj: any, prefix: string = '') {
            if (obj === null || obj === undefined) {
                return; // Exit the recursion if the current object is null or undefined
            }

            Object.entries(obj).forEach(([key, value]) => {
                const newKey = prefix ? `${prefix}${key}` : key; // Adjusted to add a dot for nested properties

                if (typeof value === 'object' && !Array.isArray(value)) {
                    recurse(value, `${newKey}-`); // Pass newKey with a trailing dot for nesting
                } else if (Array.isArray(value) && value.length > 0) {
                    // Handle arrays differently to ensure we capture the array notation
                    recurse(value[0], `${newKey}-`);
                    // value.forEach((item, index) => {
                    //     // This will handle arrays of objects or arrays of primitive values
                    //     if (typeof item === 'object') {
                    //         recurse(item, `${newKey}`); // Adjusted to handle array of objects
                    //     } else {
                    //         keys.push(`${newKey}[${index}]`); // For arrays of primitives
                    //     }
                    // });
                } else {
                    keys.push(newKey);
                }
            });
        }

        recurse(data[0]); // Start recursion with the input object itself
        return keys;
    }


    async setData(jsonData: any) {
        let results: any = []
        if (jsonData && jsonData.length > 0 && jsonData[0].type === 'json') {
            results = this.extractKeys(jsonData[0].jsonData)
        }
        let headerIncludeFlag = this.isHeader;
        let createColumns: any = [];
        if (jsonData && jsonData.length > 0 && (!this.updateTxtBtn)) {
            const firstRow = jsonData && jsonData[0].type === 'json' ? results : jsonData[0].jsonData[0];
            if (headerIncludeFlag) {
                for (let index = 0; index < firstRow.length; index++) {
                    const column = firstRow[index];
                    if (!column) {
                        this.snackBar.error('File is invalid');
                        this.columns = [];
                        this.displayedColumns = [];
                        this.extraDisplayedColumns = [];
                        this.extraConditionalOptions = [];
                        this.addedColumns = [];
                        this.jsonData = [];
                        this.horizontalStepperForm.get('step1').patchValue({ jsonData: '' });
                        return;
                    }
                    createColumns.push({
                        name: (column).toString(), selectedOption: '', filter: [], multipleMapping: [], required: false, upperCase: false, eithercolumn: false, multiplemapping: false,
                        firstorlast: false, lastornothing: false
                    });
                }
            } else {
                for (let index = 0; index < firstRow.length; index++) {
                    createColumns.push({
                        name: index.toString(), selectedOption: '', filter: [], multipleMapping: [], required: false, upperCase: false, eithercolumn: false, multiplemapping: false,
                        firstorlast: false, lastornothing: false
                    });
                }
            }
        } else {
            if (this.importService.templete && this.importService.templete.length > 0) {
                const firstRow = this.importService.templete;
                if (headerIncludeFlag) {
                    for (let index = 0; index < firstRow.length; index++) {
                        const column = firstRow[index];
                        if (!column) {
                            this.snackBar.error('File is invalid');
                            this.columns = [];
                            this.displayedColumns = [];
                            this.extraDisplayedColumns = [];
                            this.extraConditionalOptions = [];
                            this.addedColumns = [];
                            this.jsonData = [];
                            this.horizontalStepperForm.get('step1').patchValue({ jsonData: '' });
                            return;
                        }
                        createColumns.push({
                            mappingLineId: column.mappingLineId, name: column.field ? column.field : column.multifield, selectedOption: '', filter: [], multipleMapping: [], required: false, upperCase: false, eithercolumn: false, multiplemapping: false,
                            firstorlast: false, lastornothing: false
                        });
                    }
                } else {
                    for (let index = 0; index < firstRow.length; index++) {
                        createColumns.push({
                            name: index.toString(), selectedOption: '', filter: [], multipleMapping: [], required: false, upperCase: false, eithercolumn: false, multiplemapping: false,
                            firstorlast: false, lastornothing: false
                        });
                    }
                }
            }
        }
        this.columns = createColumns;
        if (!this.updateTxtBtn && jsonData && jsonData.length > 0 && jsonData[0].type != 'json') {
            const occurrenceMap = this.countOccurrences(this.columns);
            let result: any = Object.entries(occurrenceMap).filter(([_, count]: any) => count > 1);
            if (result.length > 0) {
                this.isErrorVisible = false;
                this.apiNotCall = false;
                if (headerIncludeFlag) {
                    this.snackBar.error('The uploaded file contains a header row, while the selected template does not have a header. Please upload a valid file without the header row.');
                    this.columns = [];
                    this.displayedColumns = [];
                    this.extraDisplayedColumns = [];
                    this.extraConditionalOptions = [];
                    this.addedColumns = [];
                    this.jsonData = [];
                    this.horizontalStepperForm.get('step1').patchValue({ jsonData: '' });
                }
                result = [];
                // this.dataSource = new MatTableDataSource<any>([]);
                this.tableData = [];

                // clear form
                return;
            } else {
                result = [];
                this.isErrorVisible = true
            }
        }

        if (!this.columnArray && headerIncludeFlag) {
            this.options.length > 0 && this.options.map((data: any) => {
                this.columns.map((item: any) => {
                    if (data.name.replace(/\s+/g, '').toLowerCase() === item.name.replace(/\s+/g, '').toLowerCase()) {
                        item.selectedOption = data.value
                    }
                })
            })
            if (this.options) {
                this.columns.map((item: any, index: any) => {
                    this.options.map((column: any) => {
                        if (column.value == item.selectedOption) {
                            this.selectedOptions[index] = column.value
                        }
                    })
                })
            }
        }
        if (this.columnArray && this.columnArray.length > 0) {
            const map = new Map();
            const sameMapToValues: any[] = [];
            const duplicates: Set<string> = new Set();

            for (const item of this.columnArray) {
                const value = item['map_to'];

                if (map.has(value)) {
                    // If the value is already in the map, add it to the duplicates set
                    duplicates.add(value);
                } else {
                    // If the value is not in the map, add it to the map
                    map.set(value, true);
                }
            }
            duplicates.forEach(value => {
                const filteredArray = this.columnArray
                    .filter(item => item.map_to == value); // Adjust 'map_to' to your actual property name
                sameMapToValues.push(filteredArray);
            });
            if (sameMapToValues && sameMapToValues.length > 0) {
                for (let i = 0; i < sameMapToValues.length; i++) {
                    sameMapToValues[i].map((item: any) => {
                        this.columnArray.map((data: any, i: any) => {
                            if (item.mappingLineId == data.mappingLineId) {
                                this.columnArray.splice(i, 1);
                            }
                        })
                    })
                }
                let newObj: any = {}
                let newMultiField: any = ''
                for (let i = 0; i < sameMapToValues.length; i++) {
                    sameMapToValues[i].map((item: any) => {
                        newMultiField = `{${item.field}}` + ',' + (newMultiField || '');
                        newObj.mapping_id = item.mapping_id;
                        newObj.mappingLineId = item.mappingLineId;
                        newObj.field = null;
                        newObj.upper_case = false;
                        newObj.is_compulsory = false;
                        newObj.map_to = item.map_to;
                        newObj.filter = item.filter;
                        newObj.eithercolumn = true;
                    })
                    newObj.multifield = `%${newMultiField}%`
                    this.columnArray.push(newObj)
                    newMultiField = ''
                    newObj = {}
                }
            }

            this.columnArray.map((data: any) => {
                this.columns.map((item: any) => {
                    if (data.field === item.name) {
                        for (let i = 0; i < this.options.length; i++) {
                            if (this.options[i].name.toLowerCase() == item.name.toLowerCase() && this.isHeader) {
                                if (this.options[i].value == data.map_to) {
                                    item.selectedOption = data.map_to
                                    item.filter = data.filter
                                    item.upperCase = data.upper_case
                                    item.required = data.is_compulsory
                                }
                            } else {
                                item.selectedOption = data.map_to
                                item.filter = data.filter
                                item.upperCase = data.upper_case
                                item.required = data.is_compulsory
                            }
                        }
                    } else {
                        if (data.multifield) {
                            let result: any = this.extractMixStringForConditionalMapping(data)
                            if (data.mappingLineId == item.mappingLineId) {
                                item.firstorlast = result.firstOrLast
                                item.eithercolumn = result.eithercolumn
                                item.lastornothing = result.lastOrNothing
                                item.multipleMapping = result.resultArray
                                item.selectedOption = data.map_to
                                item.filter = data.filter
                                item.upperCase = data.upper_case
                                item.required = data.is_compulsory
                                item.name = data.multifield
                            }
                        }
                    }
                })
            })

            this.columns = this.columns.filter((item, index, array) => {
                // Check if selectedOption is not empty and not repeated
                const isUniqueSelectedOption = item.selectedOption !== '';

                // Check if name is not repeated
                const isUnique = array.findIndex(obj => obj.name === item.name && obj.selectedOption === item.selectedOption) === index;

                // Return true if both conditions are met
                return isUniqueSelectedOption && isUnique;
            });
        }


        if (this.columns.length > 0) {
            if (this.columnArray) {
                this.columns.map((item: any, index: any) => {
                    this.columnArray.map((column: any) => {
                        if (column.map_to == item.selectedOption) {
                            this.selectedOptions[index] = column.map_to
                        }
                    })
                })
            }
        }

        const nameCount: { [name: string]: number } = {};
        this.extraDisplayedColumns = this.columns.map(item => {
            return item.name;
        });
        this.extraConditionalOptions = this.columns.map(item => {
            return item.name;
        });
        this.displayedColumns = this.columns.map(item => {
            const originalName = item.name;
            let originalNameForReturn = item.name;
            const count = nameCount[originalName] || 0;

            if (count > 0) {
                originalNameForReturn = `${originalName}_${count + 1}`;
            }

            nameCount[originalName] = count + 1;
            return originalNameForReturn;
        });

        this.addedColumns = this.columns.map(item => {
            const originalName = item.name;
            let originalNameForReturn = item.name;
            const count = nameCount[originalName] || 0;

            if (count > 0) {
                originalNameForReturn = `${originalName}_${count + 1}`;
            }

            nameCount[originalName] = count + 1;

            return originalNameForReturn + '*';
        });


        // this.displayedColumns = this.columns.map((x: any) => {
        //     return x.name
        // });

        // this.addedColumns = this.columns.map((x: any) => {
        //     return x.name + '*'
        // });

        this.filteredOptions = new Array(this.displayedColumns.length).fill(this.options);
        this.searchedOptions = new Array(this.displayedColumns.length).fill('');

        this.headerLength = this.addedColumns.length
        // if (this.columns.length > 12) {
        this.jsonData = [...jsonData]
        // if (!this.updateTxtBtn) {
        //     this.excelData = await this.extractData(jsonData, headerIncludeFlag);
        //     let data = await this.replaceUndefinedWithNull(this.excelData);
        //     this.importService.exelData = this.excelData;
        //     // this.tableData = this.excelData.slice(0, 10);
        // }

    }


    extractMixStringForConditionalMapping(data: any) {
        // Check for the presence of "firstorlast" or "lastornothing" flags
        const firstOrLastFlag = /firstorlast/i.test(data.multifield);
        const lastOrNothingFlag = /lastornothing/i.test(data.multifield);

        const wordsMatch = data.multifield.match(/\{(.*?)\}/g);

        // Process the matched words
        const processedWords: string[] | null = wordsMatch
            ? wordsMatch.map(word => word.replace(/[{}]/g, '').replace(/firstorlast|lastornothing/gi, ''))
            : null;

        const resultArray: any[] = [];

        if (processedWords && (firstOrLastFlag || lastOrNothingFlag)) {
            resultArray.push({ "separator": processedWords[0], "column": processedWords[1] })
            return { firstOrLast: firstOrLastFlag, lastOrNothing: lastOrNothingFlag, resultArray: resultArray };
        } else {
            const output = this.extractiStringForMultipleMapping(data.multifield)
            return { firstOrLast: firstOrLastFlag, lastOrNothing: lastOrNothingFlag, eithercolumn: data.eithercolumn ? data.eithercolumn : false, resultArray: output };
        }
    }

    extractiStringForMultipleMapping(input: string): any {
        const matches = input.match(/\{(.*?)\}/g) || [];
        const result = matches.map((match, index) => {
            const word = match.slice(1, -1).trim(); // Remove curly braces and trim spaces
            const separator = index === 0 ? null : input.split(matches[index - 1])[1][0];
            return { separator, column: word };
        });
        return result
    }


    countOccurrences(dataArray: any) {
        const occurrenceMap: any = {};

        dataArray.forEach((item: any) => {
            const key = JSON.stringify(item);
            occurrenceMap[key] = (occurrenceMap[key] || 0) + 1;
        });

        return occurrenceMap;
    }

    cancleFun() {
        this.selectedOptions = [];
    }

    replaceUndefinedWithNull(obj: any) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = obj[key];
                if (typeof value === 'object' && value !== null) {
                    // Recursively handle nested objects and arrays
                    this.replaceUndefinedWithNull(value);
                } else if (typeof value === 'undefined') {
                    // Replace undefined with null
                    obj[key] = null;
                }
            }
        }
    }

    /**
      * This function checks when user adds the same order and asks if they want to increment the quantity
      * @param qty is the quantity entered by user
      */
    public async addOrdersToList(obj: any): Promise<void> {
        this.importService.currentOrderDetailsAdded?.push(obj);
    }


    checkTextOfFilter(index: any) {
        if (this.columns[index].filter && this.columns[index].filter.length > 0) {
            return "Update Filter";
        } else {
            return "Add Filter";
        }
    }

    checkDisabledFun(index: any) {
        if (this.columns && this.columns[index].selectedOption) {
            return false;
        } else {
            return true;
        }
    }

    checkDisabledFunForFilter(index: any) {
        if (this.columns && this.columns[index].selectedOption) {
            if (this.columns[index].multipleMapping && this.columns[index].multipleMapping.length > 0) {
                this.columns[index].filter = []
                this.columns[index].required = false;
                this.columns[index].upperCase = false;
                return true;
            } else {
                return false;
            }
        } else {
            return true
        }
    }

    checkMultiMappingDisabledFun(index: any) {
        if (this.columns[index].multipleMapping && this.columns[index].multipleMapping.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    generateMultiMappingString(data: any, index: any) {
        let result: string[] = [];
        this.columns[index].multipleMapping.forEach(mapping => {
            if (mapping.separator == null) {
                result.push(mapping.column);
            } else if (mapping.separator == ',') {
                let obj = mapping.separator + mapping.column
                result.push(obj)
            } else if (mapping.separator == '.') {
                let obj = mapping.separator + mapping.column
                result.push(obj)
            } else if (mapping.separator == ' ') {
                let obj = mapping.separator + mapping.column
                result.push(obj)
            } else {
                if (this.columns[index].firstorlast) {
                    let obj = '#FirstOrLast' + mapping.separator + ',' + mapping.column
                    result.push(obj)
                } else if (this.columns[index].lastornothing) {
                    let obj = '#LastOrNothing' + mapping.separator + ',' + mapping.column
                    result.push(obj)
                } else {
                    let obj = mapping.separator + mapping.column
                    result.push(obj)
                }
            }
        });

        let res = this.convertArrayToString(result)
        if (res.length > 0) {
            return 'Multiple Mapping';
        } else {
            return data;
        }
    }

    convertArrayToString(inputArray: string[]): string {
        // Join the array into a single string
        let resultString = inputArray.join('');

        // Replace unwanted separators with the desired ones
        resultString = resultString.replace(/\.,/g, '. '); // Replace '.,' with '. '
        resultString = resultString.replace(/,\s/g, ', '); // Replace ', ' with ', '

        return resultString;
    }

    addFilterModel(col: any, index: any) {
        const dialog = this.matDialog.open(MappingFilterDialogComponent, {
            width: '100%',
            data: this.columns[index]
        })
        dialog.afterClosed().subscribe(data => {
            if (data) {
                this.columns[index].filter = data
            }
        })
    }

    checkBoxRequired(index: any) {
        if (this.columns[index].required) {
            return true;
        } else {
            return false;
        }
    }

    checkBoxUpperCase(index: any) {
        if (this.columns[index].upperCase) {
            return true;
        } else {
            return false;
        }
    }

    removeMultipleMapping(column: any, i: any) {
        this.extraDisplayedColumns[i] = ''
        this.columns[i].multipleMapping = []
        this.columns[i].name = ''
        this.columns[i].firstorlast = false
        this.columns[i].lastornothing = false
        this.columns[i].eithercolumn = false
        this.columns[i].multiplemapping = false
    }

    checkboxRequired(value: any, index: any) {
        this.columns[index].required = value
    }

    checkboxUperCase(value: any, index: any) {
        this.columns[index].upperCase = value
    }

    addMultipleMappingDialog(row: any, i: any) {
        const dialog = this.matDialog.open(MultipleMappingDialogComponent, {
            width: '100%',
            data: { csvColDataList: this.extraConditionalOptions, multipleMapping: this.columns[i], updateFlag: this.updateTxtBtn }
        })
        dialog.afterClosed().subscribe(data => {
            if (data) {
                if (data.firstorlast) {
                    let obj = '%%#FirstOrLast(' + `{${data.dataSource[0].separator}}` + ',' + `{${data.dataSource[0].column}})#%%`
                    this.columns[i].name = obj
                } else if (data.lastornothing) {
                    let obj = '%%#LastOrNothing(' + `{${data.dataSource[0].separator}}` + ',' + `{${data.dataSource[0].column}})#%%`
                    this.columns[i].name = obj
                } else if (data.eithercolumn) {
                    let newMultiField: any = ''
                    data.dataSource.map((item: any) => {
                        newMultiField = `{${item.column}}` + ',' + (newMultiField || '');
                    })
                    this.columns[i].name = `%${newMultiField}%`
                } else if (data.multiplemapping) {
                    let newMultiField: any = ''
                    data.dataSource.map((item: any) => {
                        newMultiField = `{${item.column}}` + item.separator + (newMultiField || '');
                    })
                    this.columns[i].name = `%%${newMultiField}%%`
                }
                this.columns[i].multipleMapping = data.dataSource
                this.columns[i].firstorlast = data.firstorlast
                this.columns[i].lastornothing = data.lastornothing
                this.columns[i].eithercolumn = data.eithercolumn
                this.columns[i].multiplemapping = data.multiplemapping
            }
        })
    }
}
