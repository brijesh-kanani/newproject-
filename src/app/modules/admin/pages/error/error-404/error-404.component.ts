import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'error-404',
    templateUrl: './error-404.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Error404Component {
    role: any
    /**
     * Constructor
     */
    constructor(private _router: Router) {
        this.role = JSON.parse(localStorage.getItem('user'))
    }
    navigateByRole() {
        if (this.role && this.role.IdRole == 1) {
            this._router.navigate(['/dashboard']);
        } else {
            this._router.navigate(['/accounts']);
        }
    }
}
