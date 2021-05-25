import { Injectable } from '@angular/core';
import { CryptoCurrency } from './crypto-currency.model';

@Injectable({
  providedIn: 'root',
})
export class BalanceService {
  constructor() {}
  private cryptoBalance: CryptoCurrency[] = [
    {
      name: 'Bitcoin',
      ticker: 'BTC',
      valueUSD: 30000,
      amount: 0.5,
      // subUnit: 'Satoshi',
      // subUnitToUnit: 100000000,
    },
    {
      name: 'Ethererum',
      ticker: 'ETH',
      valueUSD: 2000,
      amount: 3,
      // subUnit: 'GWei',
      // subUnitToUnit: 1000000000,
    },
    {
      name: 'Tether',
      ticker: 'USDT',
      valueUSD: 1,
      amount: 3000,
    },
  ];

  getBalance() {
    return [...this.cryptoBalance];
  }
}
