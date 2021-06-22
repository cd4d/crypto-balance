import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DataFetchingService } from '../data-fetching.service';
import { Coin } from './coin.model';

@Injectable({
  providedIn: 'root',
})
export class BalanceService {
  public total: number = 0;
  balanceChanged = new Subject<Coin[]>();
  currencyChanged = new Subject<string>()
  newCoin!: Coin;
  maxNumberOfCoins = 10;
  calculatedBalance: any[] = [];
  chartsData: Coin[] = [];
  CURRENCIES: string[] = [
    'usd',
    'eur',
    'cad',
    'chf',
    'aud',
    'cny',
    'jpy',
    'krw',
    'rub',
  ];
  selectedCurrency: string = 'usd';
  private cryptoBalance: Coin[] = [
    {
      name: 'Bitcoin',
      id: 'bitcoin',
      symbol: 'BTC',
      rate: 30000,
      amount: 0.5,
      subUnit: 'Satoshi',
      subUnitToUnit: 100000000,
    },
    {
      name: 'Ethereum',
      id: 'ethereum',
      symbol: 'ETH',
      rate: 2000,
      amount: 3,
      subUnit: 'GWei',
      subUnitToUnit: 1000000000,
    },
    {
      name: 'Tether',
      id: 'tether',
      symbol: 'USDT',
      rate: 1,
      amount: 3000,
    },

    {
      name: 'Dogecoin',
      id: 'dogecoin',
      symbol: 'DOGE',
      rate: 1,
      amount: 4000,
    },
    {
      name: 'Cardano',
      id: 'cardano',
      symbol: 'ADA',
      rate: 1,
      amount: 150,
    },
    {
      name: 'Ripple',
      id: 'ripple',
      symbol: 'XRP',
      rate: 1,
      amount: 200,
    },
  ];
  constructor(
    private dataFetchingService: DataFetchingService,
    private http: HttpClient
  ) { }
  // set currency for rates (usd, eur...)
  setCurrency(newCurrency: string) {
    if (this.CURRENCIES.includes(newCurrency.toLowerCase())) {
      this.selectedCurrency = newCurrency;
      this.currencyChanged.next(newCurrency)
    } else {
      console.log(newCurrency, ' not in list');
    }
  }
  getSelectedCurrency() {
    return this.selectedCurrency
  }
  getBalance() {
    return [...this.cryptoBalance];
  }
  updateBalance() {
    this.calculateBalance();
    this.balanceChanged.next(this.cryptoBalance);
  }

  saveRemoteBalance(balance: Coin[]) {
    this.http
      .post(
        'https://crypto-balance-d7b89-default-rtdb.firebaseio.com/balances.json',
        balance
      )
      .subscribe((responseData) => {
        console.log(responseData);
      });
  }

  changeAmount(symbol: string, value: number) {
    //console.log('changing amount ' + value);
    this.cryptoBalance = this.cryptoBalance.map((crypto) => {
      if (crypto.symbol === symbol) {
        crypto.amount = value;
      }
      return crypto;
    });
    this.updateBalance();
  }
  sortBalanceById(balance: Coin[]) {
    // sort by alphabetical order
    return balance.sort((a: Coin, b: Coin) => {
      let nameA = a.name.toLowerCase();
      let nameB = b.name.toLowerCase();
      if (nameA < nameB) {
        return -1; // nameA comes first
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0; // names are equal
    });
  }
  sortBalanceByValue(balance: Coin[]) {
    // sort by alphabetical order
    return balance.sort((a: Coin, b: Coin) => {
      let valueA = a.value;
      let valueB = b.value;
      if (valueA && valueB && valueA < valueB) {
        return -1; // valueA comes first
      }
      if (valueA && valueB && valueA > valueB) {
        return 1;
      }
      return 0; // values are equal
    });
  }
  getIcons() {
    // get images
    let allCoinsList = this.dataFetchingService.fetchCoinsList();
    this.cryptoBalance = this.sortBalanceById(this.cryptoBalance);
    if (allCoinsList && allCoinsList.length) {
      let count = 0;
      let i = 0;
      //console.log(this.cryptoBalance);

      for (let coin of allCoinsList) {
        // loop through all coins supported
        while (i < this.cryptoBalance.length) {
          // check local balance
          if (
            coin.id &&
            this.cryptoBalance[i].name.toLowerCase() === coin.id.toLowerCase()
          ) {
            this.cryptoBalance[i].image = coin.image;
            // increment both coins list and local balance loops
            count++;
            i++;
            //console.log(count, i, coin.id);
            break;
          } else {
            // increment only coins list
            count++;
            break;
          }
        }
        // break main loop (coins list)
        if (i >= this.cryptoBalance.length) {
          break;
        }
      }
    }
  }
  calculateBalance() {
    let coinsInBalance = this.cryptoBalance.map((coin) => coin.name);
    //console.log(this.cryptoBalance);
    console.log(
      'getting rates in: ',
      this.selectedCurrency ? this.selectedCurrency : 'usd'
    );

    this.dataFetchingService
      .getRates(
        coinsInBalance,
        this.selectedCurrency ? this.selectedCurrency : 'usd'
      )
      .subscribe(
        (res) =>
          this.cryptoBalance.map((crypto) => {
            Object.keys(res).forEach((key) => {
              if (key === crypto.name.toLowerCase()) {
                crypto.rate =
                  res[key as keyof object][
                  this.selectedCurrency ? this.selectedCurrency : 'usd'
                  ];
              }
            });
            // calculate value of each hodling and calculate total
            if (crypto.rate && crypto.amount) {
              crypto.value = +crypto.rate * +crypto.amount;
            }
            if (crypto.value) {
              this.total += crypto.value;
            }
            // get the weight of each
            if (this.total && this.total > 0) {
              if (crypto.value) {
                crypto.weight = crypto.value / this.total;
              }
            }
          }),

        (error) => {
          console.log('error fetching rates');
        },
        () => {
          console.log('got rates');
        }
      );
  }

  addCoin(coin: Coin) {
    if (this.cryptoBalance.length >= this.maxNumberOfCoins) {
      return;
    }
    this.newCoin = coin;
    if (!coin.rate) {
      console.log('getting rates');
      this.dataFetchingService
        .getRates(
          [coin.id ? coin.id : coin.name.toLowerCase()],
          this.selectedCurrency ? this.selectedCurrency : 'usd'
        )
        .subscribe((rate) => {
          this.newCoin.rate = Object.values(rate)[0][
            this.selectedCurrency ? this.selectedCurrency : 'usd'
          ];
        });
    } else {
      this.newCoin.rate = coin.rate;
    }
    //console.log(this.newCoin);
    // calculate value
    if (this.newCoin.rate && this.newCoin.amount) {
      this.newCoin.value = +this.newCoin.rate * +this.newCoin.amount;
    }

    this.cryptoBalance = [...this.cryptoBalance, this.newCoin];
    this.updateBalance();
  }

  deleteCoin(coin: Coin) {
    this.cryptoBalance = this.cryptoBalance.filter(
      (element) => element.name !== coin.name
    );
    this.updateBalance();
  }

  addSteps(coinList: Coin[]): Coin[] {
    let newCoinList = coinList.map((coin) => {
      if (coin.rate && coin.rate > 0) {
        // minValue and maxValue for slider (not implemented)
        coin.minValue =
          coin.rate > 1 ? +(1 / coin.rate).toFixed(5) : coin.rate;
        coin.maxValue = +(1000000 / coin.rate).toFixed(2); // up to $1 million for each coin
        coin.editStep = this.defaultStep(coin.rate);
      }
      return coin;
    });
    return newCoinList;
  }
  // Define the step to increment according to rate
  defaultStep(rate: number): number {
    if (rate <= 1) {
      return +(1 / rate).toFixed(5);
    }
    // increment by $10 if rate is between 1-10
    if (rate <= 10) {
      return +(10 / rate).toFixed(5);
    }
    //increment by $100
    return +(100 / rate).toFixed(5);
  }
}
