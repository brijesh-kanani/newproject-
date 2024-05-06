import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { AngularCommonModule } from 'app/mock-api/common/angular-common.modules';

@Component({
  selector: 'app-account-filter',
  templateUrl: './account-filter.component.html',
  styleUrls: ['./account-filter.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  standalone: true,
  imports: [
    AngularCommonModule
  ],
})
export class AccountFilterComponent {
  @Output() filtersApplied = new EventEmitter<any>();
  statusList = [
    { name: 'All', value: 'all' },
    { name: 'Active', value: 'active' },
    { name: 'Inactive', value: 'inactive' },
  ];
  filterForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      name: [''],
      status: ['active'],
    });
  }

  applyFilters() {
    const filters = this.filterForm.value;
    this.filtersApplied.emit(filters);
  }

}

