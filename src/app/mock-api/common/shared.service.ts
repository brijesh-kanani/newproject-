import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs/internal/Observable';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })

export class SharedService {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent> | undefined;
    accountDetails: any

    constructor(private dialog: MatDialog, private httpClient: HttpClient,
        private _router: Router,) {
    }



    /* opens a dialog with the given message and asks for actions*/
    public ask(message: any, text?: any): Promise<any> {
        return new Promise(resolve => {
            this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
                disableClose: false,
                panelClass: 'confirm-dialog',
                // data: text
            });

            this.confirmDialogRef.componentInstance.confirmMessage = message;
            this.confirmDialogRef.componentInstance.buttonText = text;
            this.confirmDialogRef.afterClosed().subscribe((result: any) => {
                resolve(result);
                this.confirmDialogRef = undefined;
            });
        });
    }

}

