import { Component, OnInit } from '@angular/core';
import { BalanceService } from '../balance.service';
import { CryptoCurrency } from '../crypto-currency.model';

@Component({
  selector: 'app-balance-list',
  templateUrl: './balance-list.component.html',
  styleUrls: ['./balance-list.component.css']
})
export class BalanceListComponent implements OnInit {

  constructor(private balanceService: BalanceService) { }
  balance: CryptoCurrency[] = [];

  ngOnInit(): void {
    this.balance = this.balanceService.getBalance()
    this.balanceService.calculateBalance()

  }

}
