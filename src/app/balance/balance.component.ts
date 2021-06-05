import { Component, OnInit } from '@angular/core';
import { DataFetchingService } from '../data-fetching.service';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css'],
})
export class BalanceComponent implements OnInit {
  constructor(
    private dataFetchingService: DataFetchingService,
  ) {}

  ngOnInit(): void {
    
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
    let formattedRates: { [key: string]: number } = {};
    this.dataFetchingService
      .fetchNews(['bitcoin'])
      .subscribe((res) => console.log(res));
  }
  // this.balanceService.addCoin({ name: 'Cardano', symbol: 'ADA' })
}
