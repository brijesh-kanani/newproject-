import { Component, ElementRef, Inject, Renderer2 } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { FileLogService } from 'app/modules/file-log/file-log.service';

@Component({
  selector: 'app-view-error-dialog',
  templateUrl: './view-error-dialog.component.html',
  styleUrls: ['./view-error-dialog.component.scss'],
  standalone: true,
  imports: [MatDialogModule, MatIconModule, NgApexchartsModule, CommonModule, MatTableModule],
})
export class ViewErrorDialogComponent {
  dataSource: any = new MatTableDataSource<[]>();
  isfullScreen = false;
  displayedColumns: string[] = [
    'fileID',
    'articalNo',
    'errorMSG',
  ];
  constructor(public dialogRef: MatDialogRef<ViewErrorDialogComponent>, private elementRef: ElementRef, private renderer: Renderer2, @Inject(MAT_DIALOG_DATA) public data: any, private filelogService: FileLogService, private _spinner: NgxSpinnerService, private _router: Router) {

  }

  ngOnInit() {
    this.getErrorData()
  }

  getErrorData() {
    let array: any = [{
      'fileID': 'EDPA-A12D-S32C',
      'articalNo': '12A0-5241-6AA0',
      'errorMSG': 'Date format not valid',
    }]
    this.dataSource.data = array
    // this._spinner.show()
    // this.filelogService.getErrorData(this.data.id).then(
    //   (response: any) => {
    //     if (response) {
    //       this.dataSource.data = response.data;
    //       this._spinner.hide()
    //     }
    //   },
    //   (error) => {
    //     this._spinner.hide();
    //     this._router.navigateByUrl('/500-not-found');
    //     console.error('Error fetching user data:', error);
    //   }
    // );
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
}
