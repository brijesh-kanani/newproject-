import { Component } from '@angular/core';
import { CustomerAccountService } from '../../customer-account.service';

@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.scss'],
  standalone: true,
})
export class CustomerProfileComponent {
  userProfileData: any
  constructor(private customerService: CustomerAccountService) {

  }

  ngOnInit(): void {
    if (this.customerService.editCrateUser && this.customerService.editCrateUser.user) {
      this.userProfileData = this.customerService.editCrateUser.user
    }
  }
}
