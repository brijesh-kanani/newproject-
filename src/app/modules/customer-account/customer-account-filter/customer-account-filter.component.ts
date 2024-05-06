import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-customer-account-filter',
  templateUrl: './customer-account-filter.component.html',
  styleUrls: ['./customer-account-filter.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSelectModule,
    MatExpansionModule
  ],
})
export class CustomerAccountFilterComponent {
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

