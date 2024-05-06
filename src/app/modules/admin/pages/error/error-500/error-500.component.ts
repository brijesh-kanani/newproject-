import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'error-500',
    templateUrl: './error-500.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Error500Component {
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
