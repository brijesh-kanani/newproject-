import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackBar } from 'app/layout/common/snack-bar/snack-bar.class';
import { DashboardService } from '../dashboard/dashboard.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss'],
  standalone: true,
  imports: [MatExpansionModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatExpansionModule,
    MatSnackBarModule
  ]
})
export class ConfigurationComponent {
  filterForm: FormGroup;
  setIntervalData: any;
  snackBar: SnackBar
  constructor(private fb: FormBuilder, private snack: MatSnackBar, private dashboardService: DashboardService, private router: Router) {
    this.snackBar = new SnackBar(snack)
  }

  ngOnInit(): void {
    this.getTimeLimite()
    this.createForm()
  }

  createForm() {
    this.filterForm = this.fb.group({
      dashboardRefreshSecond: ['', [Validators.required, Validators.pattern('[0-9]+'), Validators.min(1)]],
    });
  }

  applyFilters() {
    const user = JSON.parse(localStorage.getItem('user'))
    let body: any = {
      "id": this.setIntervalData.id,
      "time": this.filterForm.value.dashboardRefreshSecond,
      "IdUser": user.IdUser
    }
    this.dashboardService.setTimeByUser(body).then((data: any) => {
      if (data) {
        this.snackBar.success('Configurations Save Successfully')
        this.getTimeLimite()
      }
    }).catch((err) => {
      this.snackBar.error(err.errorMessage)
      console.log('err while set default time', err)
    });
  }

  getTimeLimite() {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user && user.IdUser) {
      this.dashboardService.getTimeByUser(user.IdUser).then((res: any) => {
        if (res.configuration) {
          this.setIntervalData = res.configuration
          this.filterForm.patchValue({ dashboardRefreshSecond: this.setIntervalData.time })
        } else {
          let body: any = {
            "time": 10,
            "IdUser": user.IdUser
          }
          this.dashboardService.setTimeByUser(body).then((data: any) => {
            if (data) {
              this.getTimeLimite()
            }
          }).catch((err) => {
            console.log('err while set default time', err)
          });
        }
      }).catch((err) => {
        console.log(err)
      })
    } else {
      this.snackBar.error('User id not found')
      this.router.navigate(['/sign-in'])
    }
  }

}
