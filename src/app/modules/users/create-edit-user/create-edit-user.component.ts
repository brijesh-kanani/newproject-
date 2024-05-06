import { Component, Inject, Input, EventEmitter, Output } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, FormsModule, PatternValidator, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { delay, map, startWith } from 'rxjs/operators';
import { UsersServiceService } from '../users-service.service';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Country, State, User } from '../model/user.model';
import { MatSelectModule } from '@angular/material/select';
import * as moment from 'moment';
import { MatIconModule } from '@angular/material/icon';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackBar } from 'app/layout/common/snack-bar/snack-bar.class';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-create-edit-user',
    templateUrl: './create-edit-user.component.html',
    styleUrls: ['./create-edit-user.component.scss'],
    standalone: true,
    imports: [
        MatDialogModule,
        CommonModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        MatDatepickerModule,
        MatRadioModule,
        MatSelectModule,
        MatIconModule,
        MatSnackBarModule,
        MatCardModule,
        RouterLink,
        NgIf
    ],
})
export class CreateEditUserComponent {
    snackBar: SnackBar;
    userForm: FormGroup;
    user: User;
    action: string;
    roles: any;
    countries: Country[] = [];
    public states: State[];
    // public selectedCountries: any
    selectedCountries: any;
    selectedStates: any
    length: number
    searchCtrlCountry = new FormControl('')
    searchCtrlAccount = new FormControl('')
    searchCtrlState = new FormControl('')
    filteredOptions: any;
    btnEditShow = false;
    editView = false;
    onKeydown(e: KeyboardEvent, i: HTMLInputElement) {
        i.onkeydown?.(e);
        e.stopPropagation();
    }


    constructor(
        // public dialogRef: MatDialogRef<CreateEditUserComponent>,
        public userService: UsersServiceService,
        // @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder,
        public spinner: NgxSpinnerService,
        public snack: MatSnackBar,
        private _router: Router,
    ) {
        this.snackBar = new SnackBar(snack);
        if (this.userService.editCrateUser) {
            this.action = this.userService.editCrateUser.action;
            if (this.action == 'edit') {
                this.user = this.userService.editCrateUser.user;
                this.btnEditShow = true
            } else {
                this.user = new User({})
            }

            if (this.userService.editCrateUser) {
                this.roles = this.userService.editCrateUser.roleList
            }

        } else {
            this._router.navigate(['/users'])
        }

    }

    ngOnInit() {
        this.createForm();
        this.loadCountryList();
        if (this.user?.country) {
            this.loadStateList(this.user.country)
        }

    }

    btnEditViewChange() {
        this.editView = !this.editView
    }
    createForm() {
        this.userForm = this.fb.group({
            id: [this.user?.id],
            firstName: [this.user?.firstName, [Validators.required, Validators.maxLength(50)]],
            lastName: [this.user?.lastName, [Validators.required, Validators.maxLength(50)]],
            email: [this.user?.email, [Validators.required, Validators.email]],
            sex: [this.user?.sex],
            phoneNumber: [this.user?.phoneNumber, Validators.pattern(/^\d{6,14}$/)],
            address1: [this.user?.address1, Validators.required],
            address2: [this.user?.address2],
            state_Territory: [this.user?.state_Territory],
            postCode: [this.user?.postCode, Validators.maxLength(15)],
            country: [this.user?.country],
            roleId: [this.user?.roleId, Validators.required]
        });
    }

    fetchCountryName(countryId: number) {
        if (this.countries && this.countries.length > 0) {
            let country = this.countries.find((item => item.countryID === countryId))
            if (country && country.countryName) {
                return country.countryName
            } else {
                return ''
            }
        } else {
            return ''
        }
    }

    fetchStateName(stateId: number) {
        if (this.states && this.states.length > 0) {
            let state = this.states.find((item => item.stateTerritoriesID === stateId))
            if (state && state.state_Territory) {
                return state.state_Territory
            } else {
                return ''
            }
        } else {
            return ''
        }
    }

    fetchRole(roleId: number) {
        if (this.roles && this.roles.length > 0) {
            let role = this.roles.find((item => item.roleId === roleId))
            if (role && role.roleId) {
                return role.roleName
            } else {
                return ''
            }
        } else {
            return ''
        }
    }
    phoneValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            const phonePattern = /^[0-9]{6,14}$/;;
            const valid = phonePattern.test(control.value);

            // Simulating async validation delay with delay(500)
            return of(valid ? null : { invalidPhone: true }).pipe(delay(500));
        };
    }

    public async loadCountryList(): Promise<void> {
        let countryList: any = {
            "data": [
                {
                    "countryID": 1,
                    "countryName": "Australia",
                    "createdDate": "2023-09-01T19:22:31.2266667",
                    "createdBy": "system",
                    "lastModifiedDate": "2023-09-01T19:22:31.2266667",
                    "lastModifiedBy": "system"
                }
            ]
        }
        this.countries = countryList.data
        this.length = countryList.data.length;
        this.selectedCountries = this.searchCtrlCountry.valueChanges
            .pipe(
                startWith<string | Country>(''),
                map(value => typeof value === 'string' ? value : value.countryName),
                map(name => name ? this._filterCountry(name) : this.countries.slice()),
            );
        // try {
        //     const response = await this.userService.getCountryList().toPromise();
        //     if (response) {
        //         this.countries = response.data;
        //         this.length = response.data.length;
        //         this.selectedCountries = this.searchCtrlCountry.valueChanges
        //             .pipe(
        //                 startWith<string | Country>(''),
        //                 map(value => typeof value === 'string' ? value : value.countryName),
        //                 map(name => name ? this._filterCountry(name) : this.countries.slice()),
        //             );
        //     }
        // } catch (e) {
        //     console.error(e);
        // }
    }


    blurSelectcall(value: any) {
        this.searchCtrlCountry.setValue('')
    }

    private _filterCountry(name: string): Country[] {
        const filterValue = name.toLowerCase();
        return this.countries.filter(option => option.countryName.toLowerCase().includes(filterValue.toLowerCase()));
    }

    public async loadStateList(countryId: number): Promise<void> {
        if (countryId) {
            let stateList:any=[
                {
                    "stateTerritoriesID": 1,
                    "countryID": 1,
                    "state_Territory": "Australian Capital Territory",
                    "createdDate": "2023-09-01T19:27:28.47",
                    "createdBy": "system",
                    "lastModifiedDate": "2023-09-01T19:27:28.47",
                    "lastModifiedBy": "system"
                },
                {
                    "stateTerritoriesID": 2,
                    "countryID": 1,
                    "state_Territory": "New South Wales",
                    "createdDate": "2023-09-01T19:27:28.4733333",
                    "createdBy": "system",
                    "lastModifiedDate": "2023-09-01T19:27:28.4733333",
                    "lastModifiedBy": "system"
                },
                {
                    "stateTerritoriesID": 3,
                    "countryID": 1,
                    "state_Territory": "Northern Territory",
                    "createdDate": "2023-09-01T19:27:28.48",
                    "createdBy": "system",
                    "lastModifiedDate": "2023-09-01T19:27:28.48",
                    "lastModifiedBy": "system"
                },
                {
                    "stateTerritoriesID": 4,
                    "countryID": 1,
                    "state_Territory": "Queensland",
                    "createdDate": "2023-09-01T19:27:28.48",
                    "createdBy": "system",
                    "lastModifiedDate": "2023-09-01T19:27:28.48",
                    "lastModifiedBy": "system"
                },
                {
                    "stateTerritoriesID": 5,
                    "countryID": 1,
                    "state_Territory": "South Australia",
                    "createdDate": "2023-09-01T19:27:28.48",
                    "createdBy": "system",
                    "lastModifiedDate": "2023-09-01T19:27:28.48",
                    "lastModifiedBy": "system"
                },
                {
                    "stateTerritoriesID": 6,
                    "countryID": 1,
                    "state_Territory": "Tasmania",
                    "createdDate": "2023-09-01T19:27:28.4833333",
                    "createdBy": "system",
                    "lastModifiedDate": "2023-09-01T19:27:28.4833333",
                    "lastModifiedBy": "system"
                },
                {
                    "stateTerritoriesID": 7,
                    "countryID": 1,
                    "state_Territory": "Victoria",
                    "createdDate": "2023-09-01T19:27:28.4833333",
                    "createdBy": "system",
                    "lastModifiedDate": "2023-09-01T19:27:28.4833333",
                    "lastModifiedBy": "system"
                },
                {
                    "stateTerritoriesID": 8,
                    "countryID": 1,
                    "state_Territory": "Western Australia",
                    "createdDate": "2023-09-01T19:27:28.4833333",
                    "createdBy": "system",
                    "lastModifiedDate": "2023-09-01T19:27:28.4833333",
                    "lastModifiedBy": "system"
                }
            ]
                  this.states = stateList;
                this.selectedStates = this.searchCtrlState.valueChanges
                    .pipe(
                        startWith<string | Country>(''),
                        map(value => typeof value === 'string' ? value : value.countryName),
                        map(name => name ? this._filterState(name, this.states) : this.states.slice()),
                    );
            // try {
            //     const response = await this.userService.getStateList(countryId).toPromise();
            //     this.states = response.data;
            //     this.selectedStates = this.searchCtrlState.valueChanges
            //         .pipe(
            //             startWith<string | Country>(''),
            //             map(value => typeof value === 'string' ? value : value.countryName),
            //             map(name => name ? this._filterState(name, this.states) : this.states.slice()),
            //         );
            //     // this.spinner.hide();

            // } catch (e) {
            //     console.error(e);
            // }
        }

    }

    private _filterState(name: string, state: any): Country[] {
        const filterValue = name.toLowerCase();
        return state.filter(option => option.state_Territory.toLowerCase().includes(filterValue.toLowerCase()));
    }

    onSave() {
        // this.spinner.show();
        let user: any = {
            id: (this.userForm.value.id).toString(),
            firstName: this.userForm.value.firstName,
            lastName: this.userForm.value.lastName,
            email: this.userForm.value.email,
            phoneNumber: this.userForm.value.phoneNumber,
            sex: this.userForm.value.sex,
            address1: this.userForm.value.address1,
            address2: this.userForm.value.address2,
            state_Territory: this.userForm.value.state_Territory,
            country: this.userForm.value.country,
            postCode: this.userForm.value.postCode,
            image: '',
            roleId: this.userForm.value.roleId
        }
        // this.userService.create(user)
        //     .then((res) => {
        //         // console.log(res, 'res')
        //         if (res.statusCode == 200) {
        //             const tokenString = localStorage.getItem('user') as string ? localStorage.getItem('user') as string : undefined;
        //             let user: any;
        //             if (tokenString) {
        //                 user = JSON.parse(tokenString)
        //             }
        //             if (user) {
        //                 if (user.id == res.data.id) {
        //                     let userData: any = {
        //                         id: res.data.id,
        //                         email: res.data.email,
        //                         name: res.data.firstName + ' ' + res.data.lastName,
        //                         phoneNumber: res.data.phoneNumber,
        //                         roleId: res.data.roleId,
        //                     }

        //                     // Store the user on the user service
        //                     localStorage.setItem('user', JSON.stringify(userData));
        //                     const event = new Event('localstorageupdated');
        //                     window.dispatchEvent(event);
        //                 }
        //             }
        //             this.snackBar.success(res.message);
        //         } else {
        //             this.snackBar.error(res.message);
        //         }
        //         this._router.navigate(['/users'])
        //         // this.dialogRef.close({ resultKey: 'confirm' });
        //         this.spinner.hide();
        //     }).catch((error) => {
        //         this.spinner.hide();
        //         this._router.navigate(['/users'])
        //         this._router.navigateByUrl('/500-not-found');
        //     });
    }
}
