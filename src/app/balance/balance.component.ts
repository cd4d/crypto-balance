import { Component, OnInit } from '@angular/core';
import { DataFetchingService } from '../data-fetching.service';
import { BalanceService } from './balance.service';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css'],
})
export class BalanceComponent implements OnInit {
  constructor(private dataFetchingService: DataFetchingService,
    private balanceService: BalanceService) { }

  ngOnInit(): void {
    // get rates from list
  }
  onFetchOneCrypto() {
    this.dataFetchingService
      .fetchOneCryptoCurrency('bitcoin')
      .subscribe((res) => console.log(res));
  }
  onSearchBTC() {
    this.dataFetchingService.searchCoinList('Bitcoin');
  }
  testButton() {
    //   this.dataFetchingService
    //     .getRates(['bitcoin', 'ripple'], 'usd')
    //     .subscribe((res) => console.log(res));
    // }
    this.balanceService.addCoin({ name: 'Cardano', symbol: 'ADA' })
  }
}
