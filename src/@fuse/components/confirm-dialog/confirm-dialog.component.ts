import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'fuse-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss'],
    animations: fuseAnimations,
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    imports: [MatDialogModule, MatButtonModule, MatToolbarModule, MatDividerModule, MatIconModule,]
})

export class FuseConfirmDialogComponent {
    public confirmMessage!: string;
    public buttonText!: string;

    /**
     * Constructor
     *
     * @param {MatDialogRef<FuseConfirmDialogComponent>} dialogRef
     */
    constructor(
        public dialogRef: MatDialogRef<FuseConfirmDialogComponent>
    ) {

    }

}
