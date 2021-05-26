import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CryptoCurrency } from './crypto-currency.model';

@Injectable({
  providedIn: 'root',
})
export class BalanceService {
  public total: number = 0;
  //cryptoAmount = new Subject<number>();
  balanceChanged = new Subject<CryptoCurrency[]>();
  constructor() {}
  private cryptoBalance: CryptoCurrency[] = [
    {
      name: 'Bitcoin',
      ticker: 'BTC',
      rateUSD: 30000,
      amount: 0.5,
      subUnit: 'Satoshi',
      subUnitToUnit: 100000000,
    },
    {
      name: 'Ethererum',
      ticker: 'ETH',
      rateUSD: 2000,
      amount: 3,
      subUnit: 'GWei',
      subUnitToUnit: 1000000000,
    },
    {
      name: 'Tether',
      ticker: 'USDT',
      rateUSD: 1,
      amount: 3000,
    },
  ];

  getBalance() {
    return [...this.cryptoBalance];
  }
  changeAmount(ticker: string,  value: number) {
    this.cryptoBalance = this.cryptoBalance.map((crypto) => {
      if (crypto.ticker === ticker) {
        crypto.amount = value
      }
      return crypto;
    });
    this.calculateBalance()
    this.balanceChanged.next(this.cryptoBalance)
    
  }
  calculateBalance() {
    const currentBalance = [...this.cryptoBalance];
    // calculate value of each hodling and calculate total
    currentBalance.map((crypto) => {
      crypto.valueUSD = crypto.rateUSD * crypto.amount;
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
}
