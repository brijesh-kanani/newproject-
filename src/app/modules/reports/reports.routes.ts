import { Routes } from '@angular/router';
import { BatchesComponent } from './batches/batches.component';
import { JobsComponent } from './batches/Jobs/Jobs.component';
import { JobsDetailsComponent } from './batches/Jobs/JobsDetails/JobsDetails.component';
import { ReportLogComponent } from './report-log/report-log.component';
import { TemplatesComponent } from './templates/templates.component';
import { AccountListComponent } from './account-list/account-list.component';
import { AccountDetailsTabComponent } from './account-list/account-details-tab/account-details-tab.component';
import { BatchAddEditComponent } from './batches/Batches-add-edit/batches-add-edit.component';

export default [
    {
        path: 'batches',
        component: BatchesComponent,
    },
    {
        path: 'jobs',
        component: JobsComponent,
    },
    {
        path: 'jobs/details',
        component: JobsDetailsComponent,
    },
    {
        path: 'reports-log',
        component: ReportLogComponent,
    },
    {
        path: 'templates',
        component: TemplatesComponent,
    },
    {
        path: 'accounts',
        component: AccountListComponent,
    },
    {
        path: 'account-details',
        component: AccountDetailsTabComponent,
    },
    { path: 'batches/add-batches', component: BatchAddEditComponent },
    { path: 'batches/edit-batches/:id', component: BatchAddEditComponent },
] as Routes;
