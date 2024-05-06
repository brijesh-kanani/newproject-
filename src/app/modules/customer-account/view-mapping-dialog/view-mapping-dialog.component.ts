import { ViewEncapsulation } from '@angular/compiler';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { fuseAnimations } from '@fuse/animations';
import { CustomerAccountService } from '../customer-account.service';
import { SnackBar } from 'app/layout/common/snack-bar/snack-bar.class';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


@Component({
  selector: 'app-view-mapping-dialog',
  templateUrl: './view-mapping-dialog.component.html',
  styleUrls: ['./view-mapping-dialog.component.scss'],
  animations: fuseAnimations,
  standalone: true,
  imports: [MatToolbarModule, MatPaginatorModule, MatTableModule, MatIconModule, MatDividerModule, MatSnackBarModule],
})

export class ViewMappingDialogComponent {
  displayedColumns: any = ["name", "selectOption"]
  dataSource: any;
  snackbar: SnackBar
  constructor(private matSnackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) private _data: any, public matDialogRef: MatDialogRef<ViewMappingDialogComponent>, private customerServie: CustomerAccountService) {
    this.snackbar = new SnackBar(matSnackBar)
  }

  ngOnInit(): void {
    if (this._data) {
      this.dataSource = this._data
    } else {
      this.matDialogRef.close()
      this.snackbar.error('Mapping not found')
    }
  }

}
