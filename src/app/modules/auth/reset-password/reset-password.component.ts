import { NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { FuseValidators } from '@fuse/validators';
import { AuthService } from 'app/core/auth/auth.service';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { environment } from 'environments/environment';

@Component({
    selector: 'auth-reset-password',
    templateUrl: './reset-password.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [NgIf, FuseAlertComponent, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, RouterLink],
})
export class AuthResetPasswordComponent implements OnInit {
    @ViewChild('resetPasswordNgForm') resetPasswordNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    resetPasswordForm: UntypedFormGroup;
    showAlert: boolean = false;
    data: any;

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private _userService: UserService,
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.invokeOnInit().then()
        // Create the form

    }

    private async invokeOnInit(): Promise<void> {
        const param: any = this._router.parseUrl(this._router.url);
        if (!param.queryParams.key) {
            this.resetPasswordForm = this._formBuilder.group({
                password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-])(?=.*\d).{6,}$/)]],
                passwordConfirm: ['', Validators.required],
            },
                {
                    validators: FuseValidators.mustMatch('password', 'passwordConfirm'),
                },
            );
            this._router.navigateByUrl('/sign-in');
        } else {
            param.queryParams.token = param.queryParams.token.replace(/ /g, '+')
            this.data = param.queryParams;
            // this.checkPasswordKey();

            this.resetPasswordForm = this._formBuilder.group({
                password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-])(?=.*\d).{6,}$/)]],
                passwordConfirm: ['', Validators.required],
            },
                {
                    validators: FuseValidators.mustMatch('password', 'passwordConfirm'),
                },
            );

            // Update the validity of the 'passwordConfirm' field
            // when the 'password' field changes
            // this.updatePasswordForm?.get('password')?.valueChanges
            //     .pipe(takeUntil(this._unsubscribeAll))
            //     .subscribe(() => {
            //         this.updatePasswordForm?.get('passwordConfirm')?.updateValueAndValidity();
            //     });
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Reset password
     */
    async resetPassword(): Promise<void> {
        // Return if the form is invalid
        if (this.resetPasswordForm.invalid) {
            return;
        }

        // Disable the form
        this.resetPasswordForm.disable();

        // Hide the alert
        this.showAlert = false;
        let obj = {
            userId: this.data.key,
            token: this.data.token,
            newPassword: this.resetPasswordForm.get('password').value
        }

        // Send the request to the server
        await this._authService.resetPassword(obj)
            .then(
                (response) => {
                    // Set the alert
                    if (response.statusCode == 200) {
                        let user:any = {
                            id: response.data.userId,
                            email: response.data.email,
                            name: response.data.userName,
                            phoneNumber: response.data.phoneNumber,
                            roleId: response.data.roleId,
                        }

                        // Store the user on the user service
                        localStorage.setItem(environment.tokenKey, response.data.token)
                        localStorage.setItem('user', JSON.stringify(user))
                        this.alert = {
                            type: 'success',
                            message: 'Your password has been reset.',
                        };
                        this._router.navigate(['/dashboard']);
                    } else {
                        this.showAlert = true;
                        this.resetPasswordForm.enable();

                        // Show the alert
                        this.showAlert = true;
                        this.alert = {
                            type: 'error',
                            message: response.message,
                        };
                    }

                },
            ).catch(error => {
                this.showAlert = true;
                this.resetPasswordForm.enable();
                this.alert = {
                    type: 'error',
                    message: 'Something went wrong',
                };
            });
    }
}
