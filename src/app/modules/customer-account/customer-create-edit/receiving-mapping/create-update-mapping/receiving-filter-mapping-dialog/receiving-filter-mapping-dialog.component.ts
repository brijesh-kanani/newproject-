import { Component, ElementRef, Inject, Renderer2, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SnackBar } from 'app/layout/common/snack-bar/snack-bar.class';
import { NgxSpinnerService } from 'ngx-spinner';
import { fuseAnimations } from '@fuse/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import * as xml2js from 'xml2js';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-receiving-filter-mapping-dialog',
  templateUrl: './receiving-filter-mapping-dialog.component.html',
  styleUrls: ['./receiving-filter-mapping-dialog.component.scss'],
  animations: fuseAnimations,
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [MatDialogModule, MatButtonModule, MatToolbarModule, MatDividerModule, MatIconModule, MatFormFieldModule, ReactiveFormsModule, MatDialogModule, CommonModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, MatInputModule, MatIconModule, MatTableModule, MatSelectModule]
})
export class ReceivingFilterMappingDialogComponent {
  snackBar: SnackBar;
  templeteForm: FormGroup;
  templeteData: any;
  columns: any;
  updateData: boolean = false;
  isfullScreen: boolean = false
  displayedColumns: string[] = ['search', 'replace', 'searchType', 'ignoreCase', 'replaceWholeField', 'action'];
  dataSource: any = new MatTableDataSource<[]>();
  editedRowIndex: number = -1;
  isDisabled: boolean = true;
  originalValues: any;
  editDataList: any = []
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


  constructor(
    public matDialogRef: MatDialogRef<ReceivingFilterMappingDialogComponent>, public snack: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private router: Router,
    private _spinner: NgxSpinnerService,
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {
    this.snackBar = new SnackBar(snack);
  }

  ngOnInit(): void {
    this.checkExitData()
  }

  checkExitData() {
    if (this._data && this._data.filter.length > 0) {
      this.editDataList = JSON.parse(JSON.stringify(this._data.filter));
      this.dataSource = [...this.editDataList]
    } else {
      this.dataSource = []
    }
  }
  editRow(temp, index: number) {
    this.originalValues = { ...temp };
    this.editedRowIndex = index; // Set the index of the row being edited
  }

  cancelEdit(data: any, index: any) {
    if (data.search.trim() === '' || data.replace.trim() === '' || data.searchType === '' || data.ignoreCase === '' || data.replaceWholeField === '') {
      this.dataSource.splice(index, 1);
      this.dataSource = [...this.dataSource];
      if (this.dataSource.length == 0) {
        this.isDisabled = true;
      }
    }
    Object.assign(data, this.originalValues);
    this.editedRowIndex = -1; // Reset the edit mode

  }

  addRow() {
    let count: any = 0
    if (this.dataSource) {
      this.dataSource.map((item: any) => {
        for (const key in item) {
          if (item[key] === '') {
            this.snackBar.error("Please complete the remaining data first.")
            count++
          }
        }
      })
      if (count == 0) {
        const newRow: any = { search: '', replace: '', searchType: '', ignoreCase: '', replaceWholeField: '' };
        this.dataSource.push(newRow);
        this.dataSource = [...this.dataSource];
        this.editedRowIndex = this.dataSource.length - 1
        this.isDisabled = true;
      }
    }
  }

  deleteRow(index: any) {
    this.dataSource.splice(index, 1);
    this.dataSource = [...this.dataSource];
    if (this.dataSource.length == 0) {
      this.isDisabled = true;
    }
  }

  saveRow(i: any) {
    let checkObj = this.dataSource[i]

    if (checkObj.search.trim() === '') {
      this.snackBar.error("Please enter a search")

    } else if (checkObj.replace.trim() === '') {
      this.snackBar.error("Please enter a replace")

    } else if (checkObj.searchType === '') {
      this.snackBar.error("Please enter a search type")

    } else if (checkObj.ignoreCase === '') {
      this.snackBar.error("Please enter a ignore case")

    } else if (checkObj.replaceWholeField === '') {
      this.snackBar.error("Please enter a replace whole field")
    } else {
      this.editedRowIndex = -1;
      this.isDisabled = false;
    }
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

  saveFilter() {
    let count: any = 0
    if (this.dataSource) {
      this.dataSource.map((item: any) => {
        for (const key in item) {
          if (item[key] === '') {
            this.snackBar.error("All fields are required")
            count++
          }
        }
      })
      if (count == 0) {
        this.matDialogRef.close(this.dataSource)
      }
    }
  }
}
