import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Error401Component } from 'app/modules/admin/pages/error/error-401/error-401.component';
import { error401Routes } from 'app/modules/admin/pages/error/error-401/error-401.routing';

@NgModule({
    declarations: [
        Error401Component
    ],
    imports     : [
        RouterModule.forChild(error401Routes)
    ]
})
export class Error401Module
{
}
