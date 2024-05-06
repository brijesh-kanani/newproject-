import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatCommonModule } from '@angular/material/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TemplatesAddEditComponent } from './templates-add-edit/templates-add-edit.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TemplatesService } from './templates.service';
import { UsersFilterComponent } from 'app/modules/users/users-filter/users-filter.component';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { SnackBar } from 'app/layout/common/snack-bar/snack-bar.class';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SharedService } from 'app/mock-api/common/shared.service';

@Component({
    selector: 'app-templates',
    standalone: true,
    templateUrl: './templates.component.html',
    styleUrls: ['./templates.component.scss'],
    imports: [
        MatExpansionModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatIconModule,
        MatCommonModule,
        NgIf,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatTooltipModule,
        CommonModule,
        UsersFilterComponent,
        MatSnackBarModule,
    ],
})
export class TemplatesComponent implements OnInit, OnDestroy {
    displayedColumns: string[] = [
        'templateName',
        'reportName',
        'description',
        'formatType',
        'isActive',
        'action',
    ];

    dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
    filterForm!: FormGroup;
    data: any;
    templateDataSubscription!: Subscription;
    snackBar: SnackBar;
    filterValue: any;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private dialog: MatDialog,
        private templateService: TemplatesService,
        public matsnackBar: MatSnackBar,
        private sharedService: SharedService
    ) {
        this.snackBar = new SnackBar(matsnackBar);
        this.templateService.appliedFilters.subscribe((res) => {
            this.filterValue = res;
        });
        this.filterForm = new FormGroup({
            templateName: new FormControl(this.filterValue?.templateName),
        });
    }

    ngOnInit(): void {
        this.templateDataSubscription =
            this.templateService.templateData.subscribe(
                (res) => {
                    if (res) {
                        this.data = res;
                        this.setData();
                    }
                },
                (error) => {
                    console.error('Error fetching template data:', error);
                }
            );
    }

    setData() {
        this.dataSource = new MatTableDataSource(this.data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    }

    ngAfterViewInit(): void {
        this.setData();
    }

    addEditTemplate(templateData?: any) {
        const dialogRef = this.dialog.open(TemplatesAddEditComponent, {
            width: '100%',
            data: {
                action: templateData ? 'edit' : 'create',
                template: templateData,
            },
        });

        dialogRef.afterClosed().subscribe((data) => {
            if (data) {
                console.log(data);
            }
            this.filterForm.patchValue({
                templateName: this.filterValue.templateName,
            });
        });
    }

    applyFilters() {
        this.templateService.setFilter(this.filterForm.value);
    }

    async deleteTemplate(templateData: any) {
        const yes = await this.sharedService.ask(
            'Are you sure you want to delete this template?'
        );

        if (yes) {
            this.templateService
                .deleteTemplate(templateData)
                .then((res) => {
                    if (res) {
                        this.snackBar.success('Template deleted successfully');
                    }
                })
                .catch((Err) => {
                    this.snackBar.error('Error while deleting Template');
                    console.log(Err);
                });
        }
    }

    ngOnDestroy(): void {
        this.templateDataSubscription.unsubscribe();
        this.templateService.setFilter({ templateName: '' });
    }
}
