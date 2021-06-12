import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
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
  ) { }

  ngOnInit(): void { }
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
    //this.balanceService.saveRemoteBalance(tempBalance);
    let coinsList = this.balanceService.getBalance().map((crypto) => crypto.name);

    this.dataFetchingService.getRates(coinsList, 'usd').subscribe((res) => {
      console.log(res);

      Object.keys(res).forEach((key) => {
        // https://fettblog.eu/typescript-better-object-keys/
        console.log(res[key as keyof object]['usd'])
        
      });
    })
  
    //   this.dataFetchingService
    //     .fetchNews(['bitcoin'])
    //     .subscribe((res) => console.log(res));
    //
    // this.balanceService.addCoin({ name: 'Cardano', symbol: 'ADA' })
  }
}
