import { CommonModule } from '@angular/common';
import { ViewEncapsulation } from '@angular/compiler';
import { Component, ElementRef, Inject, Input, OnInit, Renderer2 } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { fuseAnimations } from '@fuse/animations';
import { SnackBar } from 'app/layout/common/snack-bar/snack-bar.class';
import { ImportService } from '../../import.service';
import { CustomerAccountService } from 'app/modules/customer-account/customer-account.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-view-model',
  templateUrl: './view-model.component.html',
  styleUrls: ['./view-model.component.scss'],
  animations: fuseAnimations,
  standalone: true,
  imports: [MatToolbarModule, MatPaginatorModule, MatTableModule, MatIconModule, MatDividerModule, MatSnackBarModule, MatButtonModule, CommonModule, MatTooltipModule, MatSelectModule, MatInputModule, MatFormFieldModule, FormsModule, ReactiveFormsModule],
})
export class ViewModelComponent {
  displayedColumns: any = ["selectOption", "name", "action"];
  filterDisplayedColumns: any = ["search", "replace", "searchType", "ignore_case", "replace_whole_field", "actions"];
  dataSource: any
  filterDataSource: any;
  snackBar: SnackBar;
  showFilterFlag: boolean = false;
  isfullScreen: boolean = false;
  editedRowIndex: number = -1;
  mappingEditedRowIndex: number = -1;
  isDisabled: boolean = true;
  originalValues: any[];
  editDataList: any[];
  searchTypeList: any = [{
    value: 'contains',
    name: 'Contains'
  },
  {
    value: 'exact',
    name: 'Exact'
  }];

  ignoreCaseList: any = [{
    value: true,
    name: 'True'
  },
  {
    value: false,
    name: 'False'
  }];

  replaceWholeFieldList: any = [{
    value: true,
    name: 'True'
  },
  {
    value: false,
    name: 'False'
  }]

  constructor(@Inject(MAT_DIALOG_DATA) private _data: any, public matDialogRef: MatDialogRef<ViewModelComponent>, private snack: MatSnackBar, private renderer: Renderer2,
    private elementRef: ElementRef, private importService: ImportService, private customerService: CustomerAccountService, private spinner: NgxSpinnerService) {
    this.snackBar = new SnackBar(snack)
  }

  ngOnInit(): void {
    if (this._data && this._data.mapping.mappingAttributes) {
      this._data.mapping.mappingAttributes.map((data: any) => {
        if (data.multifield) {
          const pattern = /\s*=>\s*/;
          let checkFlag: boolean = false;
          if (pattern.test(data.multifield)) {
            checkFlag = true;
          } else {
            checkFlag = false;
          }
          if (!checkFlag) {
            let input = data.multifield.replace(/%%|\{|\}|\(|\)|#|/g, '')
            const firstOrLastFlag = /firstorlast/i.test(input);
            const lastOrNothingFlag = /lastornothing/i.test(input);
            input = input.replace(/firstorlast|lastornothing/gi, '')
            if (firstOrLastFlag) {
              input = 'FirstOrLast' + ' => ' + input
            } else if (lastOrNothingFlag) {
              input = 'LastOrNothing' + ' => ' + input
            } else {
              input = 'MultipleMapping' + ' => ' + input
            }
            data.multifield = input
          }
        }
      })
      this.editDataList = JSON.parse(JSON.stringify(this._data.mapping.mappingAttributes));
      this.dataSource = [...this.editDataList]
    } else {
      this.snackBar.error('Data not found')
      this.matDialogRef.close()
    }
  }

  showFilterTabel(row: any) {
    if (row && row.filter && row.filter.length > 0) {
      this.filterDataSource = row.filter
    } else {
      this.filterDataSource = []
    }
    this.showFilterFlag = true
  }

  toggleFullscreen() {
    const dialogRefElement = this.elementRef.nativeElement.parentElement;
    if (!this.isfullScreen) {
      this.isfullScreen = true
      this.renderer.setStyle(dialogRefElement, 'width', `100vw`);
      this.renderer.setStyle(dialogRefElement, 'max-width', `100vw`);
      this.renderer.setStyle(dialogRefElement, 'max-height', `100vh`);
      this.renderer.setStyle(dialogRefElement, 'height', `100vh`);
    } else {
      this.isfullScreen = false
      this.renderer.setStyle(dialogRefElement, 'width', `100%`);
      this.renderer.setStyle(dialogRefElement, 'height', `100%`);
    }
  }


  editRow(temp: any, index: number) {
    this.originalValues = { ...temp };
    this.editedRowIndex = index; // Set the index of the row being edited
  }

  mappingEditRow(temp: any, index: number) {
    if (this.mappingEditedRowIndex != -1) {
      this.dataSource = [
        ...this.dataSource.slice(0, this.mappingEditedRowIndex),
        { ...this.originalValues },
        ...this.dataSource.slice(this.mappingEditedRowIndex + 1)
      ];
    }
    this.originalValues = { ...temp };
    this.mappingEditedRowIndex = index; // Set the index of the row being edited
  }

  cancelEdit(data: any, index: any) {
    Object.assign(data, this.originalValues);
    this.editedRowIndex = -1; // Reset the edit mode
  }

  addRow() {
    const newRow: any = { search: '', replace: '', searchType: '', ignoreCase: '', replaceWholeField: '' };
    this.filterDataSource.push(newRow);
    this.filterDataSource = [...this.filterDataSource];
    this.editedRowIndex = this.filterDataSource.length - 1
    this.isDisabled = true;
  }

  async deleteFilterRow(row: any) {
    this.spinner.show();
    await this.importService.deleteMappingFilterRow(row).then((res: any) => {
      if (res) {
        this.snackBar.success(res.message);
        setTimeout(() => {
          if (this.customerService.mappingData) {
            this.customerService.mappingData[0].mappingAttributes.map((item: any) => {
              if (row.mapping_line_id === item.mappingLineId) {
                item.filterDetails = item.filter.filter(del => del.line_filter_id !== row.line_filter_id)
                this.filterDataSource = item.filterDetails
              }
              if (item.multifield) {
                const pattern = /\s*=>\s*/;
                let checkFlag: boolean = false;
                if (pattern.test(item.multifield)) {
                  checkFlag = true;
                } else {
                  checkFlag = false;
                }
                if (!checkFlag) {
                  let input = item.multifield.replace(/%%|\{|\}|\(|\)|#|/g, '')
                  const firstOrLastFlag = /firstorlast/i.test(input);
                  const lastOrNothingFlag = /lastornothing/i.test(input);
                  input = input.replace(/firstorlast|lastornothing/gi, '')
                  if (firstOrLastFlag) {
                    input = 'FirstOrLast' + ' => ' + input
                  } else if (lastOrNothingFlag) {
                    input = 'LastOrNothing' + ' => ' + input
                  } else {
                    input = 'MultipleMapping' + ' => ' + input
                  }
                  item.multifield = input
                }
              }
            })
            this.dataSource = this.customerService.mappingData[0].mappingAttributes
            const createArray = {
              WarehouseId: this.importService.mappingWarehouseData
            };
            const dataArray = Object.values(createArray);
            this.importService.updateTempList.next(dataArray)
          }
          this.spinner.hide();
        }, 500)
      }
    }).catch((err: any) => {
      this.spinner.hide();
      this.snackBar.error(err.message);
      console.log(err)
    })
    // this.filterDataSource.splice(index, 1);
    // this.filterDataSource = [...this.filterDataSource];
    // if (this.filterDataSource.length == 0) {
    //   this.isDisabled = true;
    // }
  }

  saveRow(i: any) {
    let checkObj = this.filterDataSource[i]
    if (checkObj.search.trim() === '') {
      this.snackBar.error("Please enter a search")

    } else if (checkObj.replace.trim() === '') {
      this.snackBar.error("Please enter a replace")

    } else if (checkObj.searchType === '') {
      this.snackBar.error("Please enter a search type")

    } else if (checkObj.ignore_case === '') {
      this.snackBar.error("Please enter a ignore case")

    } else if (checkObj.replace_whole_field === '') {
      this.snackBar.error("Please enter a replace whole field")
    } else {
      this.importService.updateMappingFilterRow(checkObj).then((res: any) => {
        if (res) {
          this.snackBar.success(res.message)
          this.editedRowIndex = -1;
        }
      }).catch((err: any) => {
        this.snackBar.error(err.message)
        console.log(err)
      })
    }
  }

  mappingSaveRow(i: any) {
    let checkObj = this.dataSource[i]
    if (checkObj.field === '') {
      this.snackBar.error("Please enter a csv column")
    } else {
      this.importService.updateMappingRow(checkObj).then((res: any) => {
        if (res) {
          res['mappingLineData']['WarehouseId'] = this.importService.mappingWarehouseData;
          const convertToArray = Object.values(res);
          this.importService.updateTempList.next(convertToArray)
          this.snackBar.success(res.message)
          this.mappingEditedRowIndex = -1;
        }
      }).catch((err: any) => {
        this.snackBar.error(err.message)
        console.log(err)
      })
    }
  }


  mappingCancelEdit(data: any, index: any) {
    Object.assign(data, this.originalValues);
    this.mappingEditedRowIndex = -1; // Reset the edit mode
  }

  // saveFilter() {
  //   let count: any = 0
  //   if (this.filterDataSource) {
  //     this.filterDataSource.map((item: any) => {
  //       for (const key in item) {
  //         if (item[key] === '') {
  //           this.snackBar.error("All fields are required")
  //           count++
  //         }
  //       }
  //     })
  //     if (count == 0) {
  //       console.log(this.filterDataSource, 'filterDataSource')
  //     }
  //   }
  // }

  onKeyDown(event: KeyboardEvent): void {
    const forbiddenPattern = /[.,*($%!<!>\/?"':{}()&^#@\[\]\-_;~`|\\]/;

    if (forbiddenPattern.test(event.key)) {
      event.preventDefault();
    }
  }

  backButtonFun() {
    if (!this._data.odeoFlag) {
      let callObj: any = [{
        "call": true
      }]
      this.importService.updateTempList.next(callObj)
      setTimeout(() => {
        this.customerService.mappingData[0].mappingAttributes.map((item: any) => {
          if (item.multifield) {
            const pattern = /\s*=>\s*/;
            let checkFlag: boolean = false;
            if (pattern.test(item.multifield)) {
              checkFlag = true;
            } else {
              checkFlag = false;
            }
            if (!checkFlag) {
              let input = item.multifield.replace(/%%|\{|\}|\(|\)|#|/g, '')
              const firstOrLastFlag = /firstorlast/i.test(input);
              const lastOrNothingFlag = /lastornothing/i.test(input);
              input = input.replace(/firstorlast|lastornothing/gi, '')
              if (firstOrLastFlag) {
                input = 'FirstOrLast' + ' => ' + input
              } else if (lastOrNothingFlag) {
                input = 'LastOrNothing' + ' => ' + input
              } else {
                input = 'MultipleMapping' + ' => ' + input
              }
              item.multifield = input
            }
          }
        })
        this.dataSource = this.customerService.mappingData[0].mappingAttributes
        this.showFilterFlag = false
      }, 50)
    } else {
      this.showFilterFlag = false
    }
  }
}
