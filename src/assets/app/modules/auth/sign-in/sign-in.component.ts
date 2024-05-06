import { NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { ReleaseNoteComponent } from '../release-note/release-note.component';

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [RouterLink, FuseAlertComponent, NgIf, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatProgressSpinnerModule],
})
export class AuthSignInComponent implements OnInit {
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    version: string = "V1.0.19-ir"
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    signInForm: UntypedFormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private dialog: MatDialog
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.signInForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            // rememberMe: [''],
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    async signIn(): Promise<void> {
        // Return if the form is invalid
        if (this.signInForm.invalid) {
            return;
        }

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;

        const user: any = {
            'EmailUser': this.signInForm.value.email,
            'PasswordUser': this.signInForm.value.password
        };
        // Sign in
        await this._authService.authentication(user).then((response) => {
            if (response.data) {
                // Navigate to the redirect url
                if (response.data && response.data.user && response.data.user.IdRole == 1) {
                    this._router.navigate(['/dashboard']);
                } else {
                    this._router.navigate(['/accounts']);
                }

                this.signInForm.enable();

                // Reset the form
                this.signInNgForm.resetForm();

                this.alert = {
                    type: 'success',
                    message: 'successfully login',
                };
                this.showAlert = true;
            }
            if (response.error?.errorMessage) {
                this.alert = {
                    type: 'error',
                    message: response.error?.errorMessage,
                };
            }

        }).catch((error) => {
            console.log(error, 'error');
            this.signInForm.enable();

            // Reset the form
            this.signInNgForm.resetForm();
            if (error && error.status == 0) {
                this.alert = {
                    type: 'error',
                    message: 'Something went wrong',
                };
            } else {
                this.alert = {
                    type: 'error',
                    message: error.error.message,
                };
            }

            this.showAlert = true;
        });
        // this._authService.signIn(this.signInForm.value)
        //     .subscribe(
        //         () => {
        //             // Set the redirect url.
        //             // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
        //             // to the correct page after a successful sign in. This way, that url can be set via
        //             // routing file and we don't have to touch here.
        //             const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';

        //             // Navigate to the redirect url
        //             this._router.navigateByUrl(redirectURL);

        //         },
        //         (response) => {
        //             // Re-enable the form
        //             this.signInForm.enable();

        //             // Reset the form
        //             this.signInNgForm.resetForm();

        //             console.log(response,'0000')

        //             // Set the alert
        //             this.alert = {
        //                 type: 'error',
        //                 message: 'Wrong email or password',
        //             };

        //             // Show the alert
        //             this.showAlert = true;
        //         },
        //     );
    }

    openReleaseNote() {
        this.dialog.open(ReleaseNoteComponent, {
            width: '100%',
            data: {
                version: this.version
            }
        })
    }
}
