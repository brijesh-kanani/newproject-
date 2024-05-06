import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Platform } from '@angular/cdk/platform';

export class SnackBar {

    private _horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    private _verticalPosition: MatSnackBarVerticalPosition = 'top';
    private deviceService = new DeviceDetectorService(Platform);

    constructor(private _snackBar: MatSnackBar) {
    }

    success(message: string, duration: number = 3): void {
        this._snackBar.open(message, '', {
          duration: duration * 1000,
          horizontalPosition: this._horizontalPosition,
          verticalPosition: this._verticalPosition,
          panelClass: ['snack-panel-success', this.deviceService.isMobile() ? 'mobileSnackBarClass' : 'tabletAndDesktopSnackBarClass']
        });
      }

    error(message: string, duration: number = 3): void {
        this._snackBar.open(message, '', {
            duration: duration * 1000,
            horizontalPosition: this._horizontalPosition,
            verticalPosition: this._verticalPosition,
            panelClass: ['snack-panel-error', this.deviceService.isMobile() ? 'mobileSnackBarClass' : 'tabletAndDesktopSnackBarClass']
        });
    }

    warning(message: string, duration: number = 3): void {
        this._snackBar.open(message, '', {
            duration: duration * 1000,
            horizontalPosition: this._horizontalPosition,
            verticalPosition: this._verticalPosition,
            panelClass: ['snack-panel-warning', this.deviceService.isMobile() ? 'mobileSnackBarClass' : 'tabletAndDesktopSnackBarClass'],
        });
    }

    public info(message: string, duration: number = 3): void {
        this._snackBar.open(message, '', {
            duration: duration * 1000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['snack-panel-info']
        });
    }
}
