import { Component, OnInit } from '@angular/core';
import { BalanceService } from './balance.service';
import { CryptoCurrency } from './crypto-currency.model';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css'],
})
export class BalanceComponent implements OnInit {
  balance: CryptoCurrency[] = [];
  constructor(private balanceService: BalanceService) {}

  ngOnInit(): void {
    this.balance = this.balanceService.getBalance()
  }
}
