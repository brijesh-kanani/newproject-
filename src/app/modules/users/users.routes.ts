import { Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import { CreateEditUserComponent } from './create-edit-user/create-edit-user.component';

export default [
    {
        path     : '',
        component: UsersComponent,
    },
    {
        path     : 'create-edit',
        component: CreateEditUserComponent,
    },
] as Routes;
