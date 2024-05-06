import { Routes } from '@angular/router';
import { FileLogComponent } from './file-log.component';
import { ViewSummaryDialogComponent } from './view-summary-dialog/view-summary-dialog.component';

export default [
    {
        path: '',
        component: FileLogComponent,
    },
    {
        path: 'view-log',
        component: ViewSummaryDialogComponent,
    },
] as Routes;
