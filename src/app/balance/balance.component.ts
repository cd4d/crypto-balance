import { Component, OnInit } from '@angular/core';
import { DataFetchingService } from '../data-fetching.service';
import { BalanceService } from './balance.service';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css'],
})
export class BalanceComponent implements OnInit {
  constructor(
    private dataFetchingService: DataFetchingService,
    private balanceService: BalanceService
  ) {}

  ngOnInit(): void {}
  onFetchOneCrypto() {
    this.dataFetchingService
      .fetchOneCryptoCurrency('bitcoin')
      .subscribe((res) => console.log(res));
  }
  onSearchBTC() {
    this.dataFetchingService.searchCoinList('Bitcoin');
  }
  testButton() {
    let tempBalance = this.balanceService.getBalance();
    this.balanceService.saveRemoteBalance(tempBalance);

    //   this.dataFetchingService
    //     .fetchNews(['bitcoin'])
    //     .subscribe((res) => console.log(res));
    //
    // this.balanceService.addCoin({ name: 'Cardano', symbol: 'ADA' })
  }
}
