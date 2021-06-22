import { Component, OnInit } from '@angular/core';
import { BalanceService } from '../balance/balance.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  currenciesList = this.balanceService.CURRENCIES;
  selectedCurrency = this.balanceService.selectedCurrency;
  constructor(private balanceService: BalanceService) {}

  ngOnInit(): void {}
  onSelectCurrency(event: Event) {
    let newCurrency = (<HTMLInputElement>event.target).value;
    this.balanceService.setCurrency(newCurrency);
    // update balance with new currency
    this.balanceService.balanceChanged.next(this.balanceService.getBalance())
  }
}
