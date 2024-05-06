import { Routes } from '@angular/router';
import { CustomerAccountComponent } from './customer-account.component';
import { CustomerCreateEditComponent } from './customer-create-edit/customer-create-edit.component';

export default [
    {
        path     : '',
        component: CustomerAccountComponent,
    },
    {
        path     : 'details',
        component: CustomerCreateEditComponent,
    },
] as Routes;
