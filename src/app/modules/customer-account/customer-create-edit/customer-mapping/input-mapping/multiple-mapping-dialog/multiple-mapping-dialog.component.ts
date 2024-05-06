import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SnackBar } from 'app/layout/common/snack-bar/snack-bar.class';
import { NgxSpinnerService } from 'ngx-spinner';
import { ImportService } from '../../import.service';
import { fuseAnimations } from '@fuse/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-multiple-mapping-dialog',
  templateUrl: './multiple-mapping-dialog.component.html',
  styleUrls: ['./multiple-mapping-dialog.component.scss'],
  animations: fuseAnimations,
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [MatDialogModule, MatButtonModule, MatToolbarModule, MatDividerModule, MatIconModule, MatFormFieldModule, ReactiveFormsModule, MatDialogModule, CommonModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, MatInputModule, MatButtonModule, MatIconModule, MatSelectModule, MatTableModule, MatSnackBarModule]
})
export class MultipleMappingDialogComponent {
  sepratorDropdownDataList = [{
    name: 'Comma',
    value: ','
  }, {
    name: 'Dot',
    value: '.'
  }, {
    name: 'Space',
    value: ' '
  },
  ]
  conditionalDataList = [{
    name: 'Multiple Mapping',
    value: 'multiplemapping'
  }, {
    name: 'First Or Last',
    value: 'firstorlast'
  }, {
    name: 'Last Or Nothing',
    value: 'lastornothing'
  }, {
    name: 'Either Column',
    value: 'eithercolumn'
  },
  ]
  csvDropdownDataList: any = []
  displayedColumns: string[] = ['separator', 'column'];
  eitherdisplayedColumns: string[] = ['column'];
  dataSource: any[] = [];
  snackbar: SnackBar;
  firstorlast: boolean = false;
  lastornothing: boolean = false;
  eithercolumn: boolean = false;
  multiplemapping: boolean = false;
  conditionalMappingValue: any;
  selectedOptionsByRow: any[] = [];
  originalData: any;

  constructor(
    public matDialogRef: MatDialogRef<MultipleMappingDialogComponent>,
    private snack: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public _data: any,
  ) {
    this.snackbar = new SnackBar(snack)
  }


  ngOnInit() {
    if (this._data && this._data.csvColDataList && this._data.csvColDataList.length > 0) {
      if (this._data.updateFlag) {
        this.csvDropdownDataList = this.extractCsvColunmForDropdown(this._data.csvColDataList)
      } else {
        this.csvDropdownDataList = this._data.csvColDataList.sort()
      }
    }
    if (this._data && this._data.multipleMapping && this._data.multipleMapping.multipleMapping && this._data.multipleMapping.multipleMapping.length > 0) {
      this.originalData = JSON.parse(JSON.stringify(this._data.multipleMapping.multipleMapping));
      this.dataSource = [...this.originalData];
    } else {
      this.dataSource = [{ separator: null, column: null }, { separator: null, column: null }]
    }
    if (this._data && this._data.multipleMapping) {
      this.firstorlast = this._data.multipleMapping.firstorlast
      this.lastornothing = this._data.multipleMapping.lastornothing
      this.eithercolumn = this._data.multipleMapping.eithercolumn
      this.multiplemapping = this._data.multipleMapping.multiplemapping
    }
    if (this.firstorlast) {
      this.conditionalMappingValue = 'firstorlast'
      this.firstorlast = true
    }
    else if (this.lastornothing) {
      this.conditionalMappingValue = 'lastornothing'
      this.lastornothing = true
    }
    else if (this.eithercolumn) {
      this.conditionalMappingValue = 'eithercolumn'
      this.eithercolumn = true
    } else {
      this.conditionalMappingValue = 'multiplemapping'
      this.multiplemapping = true
    }
  }

  extractCsvColunmForDropdown(inputArray: any) {
    const items = [];

    inputArray.forEach(item => {
      const curlyBraceMatches = item.match(/\{([^}]+)\}/g) || [];
      const addresses = curlyBraceMatches.map(match => match.replace(/\{|\}/g, '').trim());

      // Check if multi-word phrases exist in the item
      // const phraseMatches = item.match(/".*?"|\b[\w\s]+\b/g) || [];
      const phraseMatches = item.match(/".*?"|\b[\w\s-]+\b/g) || [];


      // Check if #FirstOrLast() or #LastOrNothing pattern exists in the item
      const functionMatches = item.match(/#(?:FirstOrLast|LastOrNothing)\(([^)]+)\)/g) || [];
      const functionParams = functionMatches.map(match => match.replace(/#(?:FirstOrLast|LastOrNothing)\(|\)/g, '').split(',').map(param => param.trim()));

      // Exclude "#FirstOrLast" and "FirstOrLast" from the result
      const functions = functionMatches.map(match => match.match(/#(?:FirstOrLast|LastOrNothing)/g)[0]);

      const result = [...addresses, ...phraseMatches, ...functionParams.flat().map(param => param.replace(/\{|\}/g, ''))].filter(item => item !== "#FirstOrLast" && item !== "FirstOrLast" && item !== "#LastOrNothing" && item !== "LastOrNothing");
      items.push(...result);
    });

    // Remove duplicates from the array
    const distinctItems = Array.from(new Set(items));
    return distinctItems.sort()
  }




  displayFn(option: any): string {
    return option ? option.name : '';
  }

  addDropdown(): void {
    const newRow: any = { separator: null, column: null };
    this.dataSource.push(newRow);
    this.dataSource = [...this.dataSource];
    this.bindDataSouceValueByConditional()
  }

  deleteRow(i: any) {
    this.dataSource.splice(i, 1);
    this.dataSource = [...this.dataSource];
  }

  saveMultipleMapping() {
    if (this.dataSource && this.dataSource.length > 0) {
      let isFirstRow = true; // Flag to track the first row
      let isValid = true; // Flag to track overall validation

      this.dataSource.forEach((data: any, index: any) => {
        if (!data.column) {
          this.snackbar.error('All fields are required');
          isValid = false; // Set the flag to false if column is missing
        }
        if (this.multiplemapping) {
          if (isFirstRow) {
            // Allow null or undefined separator for the first row
            // You can add additional validation logic specific to the first row here if needed
          } else {
            if (data.separator === null || data.separator === undefined) {
              this.snackbar.error('All fields are required');
              isValid = false;
            }
          }

          // Update the flag after processing the first row
          if (isFirstRow) {
            isFirstRow = false;
          }
        } else if (this.firstorlast || this.lastornothing) {
          if (!data.column || !data.separator) {
            this.snackbar.error('All fields are required');
            isValid = false; // Set the flag to false if column is missing
          } else if (this.eithercolumn) {
            if (!data.column) {
              this.snackbar.error('All fields are required');
              isValid = false; // Set the flag to false if column is missing
            }
          }
        }
      });

      if (isValid) {
        // Close the dialog only if all conditions are satisfied and all fields are filled
        let body = {
          firstorlast: this.firstorlast,
          lastornothing: this.lastornothing,
          eithercolumn: this.eithercolumn,
          multiplemapping: this.multiplemapping,
          dataSource: this.dataSource,
        };
        this.matDialogRef.close(body);
      }
    } else {
      this.snackbar.error('Data source is null or empty');
    }

  }

  changeConditionalMapping(value: any) {
    this.dataSource = [{ separator: null, column: null }]
    if (value == 'firstorlast') {
      this.firstorlast = true
      this.lastornothing = false
      this.eithercolumn = false
      this.multiplemapping = false
      this.bindDataSouceValueByConditional()
    } else if (value == 'lastornothing') {
      this.lastornothing = true
      this.firstorlast = false
      this.eithercolumn = false
      this.multiplemapping = false
      this.bindDataSouceValueByConditional()
    } else if (value == 'eithercolumn') {
      const newRow: any = { separator: null, column: null };
      this.dataSource.push(newRow);
      this.dataSource = [...this.dataSource];
      this.eithercolumn = true
      this.firstorlast = false
      this.lastornothing = false
      this.multiplemapping = false
    } else if (value == 'multiplemapping') {
      this.multiplemapping = true
      this.eithercolumn = false
      this.firstorlast = false
      this.lastornothing = false
    } else {
      this.multiplemapping = false
      this.eithercolumn = false
      this.firstorlast = false
      this.lastornothing = false
    }
  }

  removeOtherColumnOption(selectedOption: any, rowIndex: number) {
    const isOptionSelected = this.dataSource.some((row, index) => index !== rowIndex && row.column === selectedOption);

    // // If the option is selected in another row, set the previous selection to null
    if (isOptionSelected) {
      const previousRow = this.dataSource.find((row, index) => index !== rowIndex && row.column === selectedOption);
      if (previousRow) {
        previousRow.column = null;
      }
    }

    // // Update the selected option for the current row
    this.dataSource[rowIndex].column = selectedOption;
  }

  bindDataSouceValueByConditional() {
    if (this.firstorlast || this.lastornothing) {
      this.dataSource.map((item: any, index: any) => {
        if (index !== 0) {
          item.separator = ','
        }
      })
    }
  }

  checkSelection(selectedOption: any, rowIndex: number, selectionType: any) {
    if (this.dataSource && this.dataSource[0] && this.dataSource[0].column === this.dataSource[0].separator) {
      if (selectionType === 'column') {
        this.dataSource[0].separator = null
      } else {
        this.dataSource[0].column = null
      }
    }

  }

}
