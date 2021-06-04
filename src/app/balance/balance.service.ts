import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DataFetchingService } from '../data-fetching.service';
import { Coin } from './coin.model';

@Injectable({
  providedIn: 'root',
})
export class BalanceService {
  public total: number = 0;
  balanceChanged = new Subject<Coin[]>();
  newCoin!: Coin;
  private currentRate!: any;
  constructor(private dataFetchingService: DataFetchingService) {}
  private cryptoBalance: Coin[] = [
    {
      name: 'Bitcoin',
      id: 'bitcoin',
      symbol: 'BTC',
      rateUSD: 30000,
      amount: 0.5,
      subUnit: 'Satoshi',
      subUnitToUnit: 100000000,
    },
    {
      name: 'Ethereum',
      id: 'ethereum',
      symbol: 'ETH',
      rateUSD: 2000,
      amount: 3,
      subUnit: 'GWei',
      subUnitToUnit: 1000000000,
    },
    {
      name: 'Tether',
      id: 'tether',
      symbol: 'USDT',
      rateUSD: 1,
      amount: 3000,
    },
  ];

  getBalance() {
    return [...this.cryptoBalance];
  }
  changeAmount(symbol: string, value: number) {
    // console.log('changing amount ' + value);
    this.cryptoBalance = this.cryptoBalance.map((crypto) => {
      if (crypto.symbol === symbol) {
        crypto.amount = value;
      }
      return crypto;
    });
    this.calculateBalance();
    this.balanceChanged.next(this.cryptoBalance);
  }
  calculateBalance() {
    const currentBalance = [...this.cryptoBalance];
    // calculate value of each hodling and calculate total
    currentBalance.map((crypto) => {
      if (crypto.rateUSD && crypto.amount) {
        crypto.valueUSD = crypto.rateUSD * crypto.amount;
      }
      if (crypto.valueUSD) {
        this.total += crypto.valueUSD;
      }
    });
    // get the weight of each
    if (this.total && this.total > 0) {
      const currentBalance = [...this.cryptoBalance];
      currentBalance.map((crypto) => {
        if (crypto.valueUSD) {
          crypto.weight = crypto.valueUSD / this.total;
        }
      });
    }
    return currentBalance;
  }
  addCoin(coin: Coin) {
    this.newCoin = coin;
    if (!coin.rateUSD) {
      this.dataFetchingService
        .getRates([coin.id ? coin.id : coin.name.toLowerCase()], 'usd')
        .subscribe((rate) => {
          this.newCoin.rateUSD = Object.values(rate)[0]['usd'];
        });
    }
    this.cryptoBalance.push(this.newCoin);
    this.calculateBalance();
    this.balanceChanged.next(this.cryptoBalance);
  }

  addSteps(coinList: Coin[]): Coin[] {
    let newCoinList = coinList.map((coin) => {
      if (coin.rateUSD && coin.rateUSD > 0) {
        // minValue and maxValue for slider (not implemented)
        coin.minValue =
          coin.rateUSD > 1 ? +(1 / coin.rateUSD).toFixed(5) : coin.rateUSD;
        coin.maxValue = +(1000000 / coin.rateUSD).toFixed(2); // up to $1 million for each coin
        coin.editStep = this.defaultStep(coin.rateUSD);
      }
      return coin;
    });
    return newCoinList;
  }
  defaultStep(rate: number): number {
    if (rate <= 1) {
      return rate;
    }

    return +(1 / rate).toFixed(5);
  }
}
