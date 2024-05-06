import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, FormsModule, PatternValidator, ReactiveFormsModule, UntypedFormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, NgIf } from '@angular/common';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { UsersServiceService } from '../users-service.service';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FuseValidators } from '@fuse/validators';
import { FuseAlertComponent } from '@fuse/components/alert';
import { fuseAnimations } from '@fuse/animations';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { SnackBar } from 'app/layout/common/snack-bar/snack-bar.class';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';

@Component({
    selector: 'app-user-reset-password',
    templateUrl: './user-reset-password.component.html',
    styleUrls: ['./user-reset-password.component.scss'],
    standalone: true,
    imports: [
        MatDialogModule,
        CommonModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDatepickerModule,
        MatRadioModule,
        FuseAlertComponent,
        NgIf,
        MatIconModule,
        MatSnackBarModule,
        MatDividerModule
    ],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class UserResetPasswordComponent {
    userForm: FormGroup;
    snackBar: SnackBar;
    constructor(public dialogRef: MatDialogRef<UserResetPasswordComponent>,
        public userService: UsersServiceService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        public snack: MatSnackBar,
    ) {
        this.snackBar = new SnackBar(snack);
    }

    ngOnInit() {
        this.createForm()
    }

    createForm() {
        this.userForm = this._formBuilder.group({
            password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-])(?=.*\d).{6,}$/)]],
            passwordConfirm: ['', Validators.required],
        },
            {
                validators: FuseValidators.mustMatch('password', 'passwordConfirm'),
            },
        );
    }


    onSave() {
        // console.log(this.userForm.value, 'this.userForm.value', this.data);
        if (this.data?.user?.id) {
            let user = {
                "userId": this.data?.user?.id,
                "token": "",
                "newPassword": this.userForm.value?.password
            }
            // this.userService.resetPassword(user)
            //     .then((res) => {
            //         if (res.statusCode == 200) {
            //             this.snackBar.success(res.message);
            //         } else {
            //             this.snackBar.error(res.message);
            //         }

            //     }).catch((error) => {
            //         this._router.navigateByUrl('/500-not-found');
            //     });
            this.dialogRef.close({ resultKey: 'confirm' });
        } else {
            this.dialogRef.close(/* any data you want to pass back */);
        }

    }
}
