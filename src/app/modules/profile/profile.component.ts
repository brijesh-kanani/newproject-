import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators, FormGroup, FormBuilder, AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FuseValidators } from '@fuse/validators';
import { ProfileService } from './profile.service';
import { Router } from '@angular/router';
import { Profile } from './profile.model';
import { UsersServiceService } from '../users/users-service.service';
import { SnackBar } from 'app/layout/common/snack-bar/snack-bar.class';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Observable, delay, of } from 'rxjs';
import { NgIf } from '@angular/common';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    standalone: true,
    imports: [CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatButtonModule,
        MatSelectModule,
        MatIconModule,
        MatSnackBarModule,
        NgIf
    ],
})
export class ProfileComponent {
    userForm: FormGroup;
    userFormPassword: FormGroup;
    profileData: Profile
    userData: any;
    snackBar: SnackBar;
    editView: boolean = true
    editViewPassword: boolean = true
    constructor(
        private fb: FormBuilder,
        private profileService: ProfileService,
        private userService: UsersServiceService,
        private _router: Router,
        public snack: MatSnackBar,
        public _spinner: NgxSpinnerService,
    ) {
        this.snackBar = new SnackBar(snack);
    }

    ngOnInit() {
        this.getUserProfile()
        this.createForm();
    }

    async getUserProfile() {
        let userData: any = localStorage.getItem('user') as string ? localStorage.getItem('user') as string : undefined;
        // console.log(userData, 'userData');
        let data = JSON.parse(userData)
        this.userData = data;
        this._spinner.show()
        if (data && data.id) {
            await this.profileService.getUserProfile(data.id)
                .then((response: any) => {
                    this.profileData = response.data
                    this.userForm.patchValue(this.profileData)
                    setTimeout(() => {
                        this._spinner.hide()
                    }, 300);
                }).catch(() => {
                    this._spinner.hide()
                    this._router.navigateByUrl('/500-not-found');
                });
        }
    }
    async onSave() {
        if (this.userData?.id) {
            let user: any = {
                "id": this.userData.id,
                "userName": "",
                "firstName": this.userForm.value?.firstName,
                "lastName": this.userForm.value?.lastName,
                "email": this.userForm.value?.email,
                "phoneNumber": this.userForm.value?.phoneNumber
            }
            this._spinner.show()
            await this.profileService.updateProfile(user)
                .then((response: any) => {
                    if (response.statusCode == 200) {
                        this.snackBar.success(response.message);
                        this.getUserProfile()
                        let userData = {
                            id: user.id,
                            email: user.email,
                            name: user.firstName + ' ' + user.lastName,
                            phoneNumber: user.phoneNumber,
                            roleId: this.userData.roleId
                        }
                        // console.log(userData);
                        // Store the user on the user service
                        localStorage.setItem('user', JSON.stringify(userData))
                        const event = new Event('localstorageupdated');
                        window.dispatchEvent(event);
                        // this.profileService.onProfileChanged.next(userData)
                    } else {
                        this.snackBar.error(response.message);
                    }
                    setTimeout(() => {
                        this._spinner.hide()
                    }, 300);
                    this.userFormPassword.reset()
                }).catch(() => {
                    this._spinner.hide()
                    this._router.navigateByUrl('/500-not-found');
                });
        } else {
            this.snackBar.error('User Id Not Found');
        }
    }

    async onChangePassword() {
        if (this.userData?.id) {
            let user: any = {
                "userId": this.userData.id,
                "userName": "",
                "currentPassword": this.userFormPassword.value?.currentPassword,
                "newPassword": this.userFormPassword.value?.password
            }
            this._spinner.show()
            await this.profileService.changePassword(user)
                .then((response: any) => {
                    if (response.statusCode == 200) {
                        this.snackBar.success(response.message);
                    } else {
                        // this.snackBar.error(response.message);
                           this.snackBar.error('Incorrect current password.');
                    }
                    setTimeout(() => {
                        this._spinner.hide()
                    }, 300);
                    this.userFormPassword.reset()
                }).catch(() => {
                    this._spinner.hide()
                    this._router.navigateByUrl('/500-not-found');
                });
        } else {
            this.snackBar.error('User Id Not Found');
        }

    }
    editChangeProfile() {
        this.editView = !this.editView
    }

    editChangePassword() {
        this.editViewPassword = !this.editViewPassword
    }
    createForm() {
        this.userForm = this.fb.group({
            firstName: ['', [Validators.required,Validators.maxLength(50)]],
            lastName: ['',[Validators.required,Validators.maxLength(50)]],
            email: ['', [Validators.required, Validators.email]],
            phoneNumber: ['', Validators.pattern(/^\d{6,14}$/)],
        });

        this.userFormPassword = this.fb.group({
            currentPassword: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-])(?=.*\d).{6,}$/)]],
            password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-])(?=.*\d).{6,}$/)]],
            passwordConfirm: ['', Validators.required],
        },
            {
                validators: FuseValidators.mustMatch('password', 'passwordConfirm'),
            },
        );
    }

}
