import { CommonModule } from '@angular/common';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { UsersFilterComponent } from './users-filter/users-filter.component';
import { UsersServiceService } from './users-service.service';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { CreateEditUserComponent } from './create-edit-user/create-edit-user.component';
import { UserResetPasswordComponent } from './user-reset-password/user-reset-password.component';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedService } from 'app/mock-api/common/shared.service';
import { SnackBar } from 'app/layout/common/snack-bar/snack-bar.class';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
    symbol: string;
}

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [CommonModule, MatIconModule, MatTableModule, MatPaginatorModule, MatSortModule, MatMenuModule, UsersFilterComponent, CreateEditUserComponent, MatSnackBarModule],
})


export class UsersComponent {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    dataSource = new MatTableDataSource;
    displayedColumns: string[] = ['firstName', 'email', 'phoneNumber', 'action'];
    roleList: any = [];
    filteredData: any = [];
    totalItemCount: number;
    snackBar: SnackBar
    users: any = [
    ];

    constructor(private snack: MatSnackBar, private userService: UsersServiceService, private dialog: MatDialog, private _router: Router, private _spinner: NgxSpinnerService, private sharedService: SharedService) {
        this.snackBar = new SnackBar(snack)
    }


    ngOnInit() {

        setTimeout(() => {
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.paginator.pageSize = 20
            this.getRoles();
            this.getUsers();

        }, 100)

    }

    getRoles() {
        let roleList :any =[
            {
                "roleId": 1,
                "roleName": "Administrator",
                "roleDescription": "System administrator with full access.",
                "isActiveRole": true,
                "createdOnRole": "2023-08-24T15:35:51.84",
                "createdByRole": "system",
                "modifiedOnRole": null,
                "modifiedByRole": null
            },
            {
                "roleId": 2,
                "roleName": "User",
                "roleDescription": "Manages customer accounts.",
                "isActiveRole": true,
                "createdOnRole": "2023-08-24T15:36:25.81",
                "createdByRole": "system",
                "modifiedOnRole": null,
                "modifiedByRole": null
            }
        ]
        this.roleList = roleList;
        // this.userService.getRoles()
        //     .then((response: any) => {
        //         if (response.length > 0) {
        //             this.roleList = response;
        //         }
        //     }).catch(() => {
        //         this._router.navigateByUrl('/500-not-found');
        //     });
    }

    getUsers() {
        let data:any = [
            {
                "firstName": "Admin1",
                "middleName": null,
                "lastName": "Tester1",
                "dob": null,
                "sex": "male",
                "address1": "addr1",
                "address2": "dssdfsf",
                "suburb": null,
                "state_Territory": 4,
                "country": 1,
                "postCode": "1456",
                "image": "",
                "roleId": 1,
                "isDeleted": false,
                "firstAccessUser": null,
                "createdOn": null,
                "createdBy": null,
                "id": "b10c62a0-41fc-44c7-8ae4-4ae69b6c5629",
                "userName": "Admin1Tester1",
                "normalizedUserName": null,
                "email": "admin@next3pl.com",
                "normalizedEmail": null,
                "emailConfirmed": false,
                "passwordHash": null,
                "securityStamp": "9c3bef0f-e102-4a43-ae76-f89de96318a6",
                "concurrencyStamp": "bdbea880-dd70-4d0b-9a93-e40644592284",
                "phoneNumber": "12345678",
                "phoneNumberConfirmed": false,
                "twoFactorEnabled": false,
                "lockoutEnd": null,
                "lockoutEnabled": false,
                "accessFailedCount": 0
            },
            {
                "firstName": "user",
                "middleName": null,
                "lastName": "demo",
                "dob": null,
                "sex": "female",
                "address1": "aaadddd",
                "address2": "aaaa",
                "suburb": null,
                "state_Territory": 1,
                "country": 1,
                "postCode": "48907",
                "image": "",
                "roleId": 2,
                "isDeleted": false,
                "firstAccessUser": null,
                "createdOn": null,
                "createdBy": null,
                "id": "dc178f31-68b2-435a-bd65-d2d5427d3d62",
                "userName": "UserDemo",
                "normalizedUserName": null,
                "email": "userdemo@next3pl.com",
                "normalizedEmail": null,
                "emailConfirmed": false,
                "passwordHash": null,
                "securityStamp": "c5254556-4706-41e1-a86d-1cf6e6509a73",
                "concurrencyStamp": "83e00915-f43c-4b91-9850-06e9604e4a9f",
                "phoneNumber": "334455555",
                "phoneNumberConfirmed": false,
                "twoFactorEnabled": false,
                "lockoutEnd": null,
                "lockoutEnabled": false,
                "accessFailedCount": 0
            }
        ]

        this.dataSource = data
        // const page = this.paginator?.pageIndex + 1 || 1; // Pagination indexes are zero-based, so add 1
        // const pageSize = this.paginator?.pageSize || 20;
        // let filter = { FirstName: this.filteredData?.name || '', page: page, pageSize: pageSize, Email: this.filteredData?.email || '', PageSortBy: this.sort?.active || 'firstName', pageSortDir: this.sort?.direction && this.sort?.direction.toUpperCase() || "ASC", roles: this.filteredData?.role || [] }
        // this._spinner.show()
        // this.userService.getUsers(filter).then(
        //     (response: any) => {
        //         this.users = response.data;
        //         this.paginator.length = response.totalRecords;
        //         this.dataSource = this.users;
        //         setTimeout(() => {
        //             this._spinner.hide()
        //         }, 300);

        //     },
        //     error => {
        //         this._spinner.hide()
        //         this._router.navigateByUrl('/500-not-found');
        //         console.error('Error fetching user data:', error);
        //     }
        // );
    }

    ngAfterViewInit() {
        this.paginator.page.subscribe(() => this.getUsers());
    }
    createUser() {

        this.userService.editCrateUser = { action: 'new', roleList: this.roleList }
        this._router.navigate(['/users/create-edit'])
    }

    editUser(user: any) {
        this.userService.editCrateUser = { action: 'edit', user, roleList: this.roleList }
        this._router.navigate(['/users/create-edit'])

    }
    resetUserPassword(user: any) {
        const dialogRef = this.dialog.open(UserResetPasswordComponent, {
            width: '750px',
            data: { editing: false, user }, // Pass any data needed for editing
        });

        dialogRef.afterClosed().subscribe(result => {
            // Handle dialog closed event if needed
            if (result && result.resultKey == "confirm") {
                if (this.paginator) {
                    this.paginator.pageSize = 20;
                    this.paginator.pageIndex = 0;
                }
                this.getUsers()
            }

        });
    }

    async deleteUser(user: any) {

        let confirmationMessage = `Are you sure you want to delete user?`;
        const yes = await this.sharedService.ask(confirmationMessage);
        if (!yes) {
            return;
        }
        // this.userService.deleteuser(user).then((response: any) => {
        //     if (response) {
        //         if (response.statusCode == 200) {
        //             if (this.paginator) {
        //                 this.paginator.pageSize = 20;
        //                 this.paginator.pageIndex = 0;
        //             }
        //             this.getUsers()
        //             this.snackBar.success(response.message);
        //         } else {
        //             this.snackBar.error(response.message);
        //         }
        //     }
        // }).catch((e) => {
        //     this.snackBar.error(e.errorMessage);
        // });
    }

    applyUserFilters(filters: any) {
        // console.log(filters);
        this.filteredData = filters
        if (this.paginator) {
            this.paginator.pageSize = 20;
            this.paginator.pageIndex = 0;
        }
        this.getUsers()
    }

}

