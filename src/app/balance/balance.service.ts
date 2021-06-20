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
  newCoin!: Coin;
  maxNumberOfCoins = 10;
  private currentRate!: any;
  calculatedBalance: any[] = [];
  chartsData: Coin[] = [];

  constructor(
    private dataFetchingService: DataFetchingService,
    private http: HttpClient
  ) {}
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
    {
      name: 'Dogecoin',
      id: 'dogecoin',
      symbol: 'DOGE',
      rateUSD: 1,
      amount: 4000,
    },
    {
      name: 'Cardano',
      id: 'cardano',
      symbol: 'ADA',
      rateUSD: 1,
      amount: 150,
    },
    {
      name: 'Ripple',
      id: 'ripple',
      symbol: 'XRP',
      rateUSD: 1,
      amount: 200,
    },
  ];

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

  calculateBalance() {
    //const currentBalance = [...this.cryptoBalance];
    //console.log(this.cryptoBalance);

    let coinsInBalance = this.cryptoBalance.map((coin) => coin.name);
    // sort by alphabetical order
    this.cryptoBalance = this.cryptoBalance.sort((a:Coin,b:Coin)=>{
      let nameA = a.name.toLowerCase()
      let nameB = b.name.toLowerCase()
      if(nameA < nameB){
        return -1 // nameA comes first
      }
      if(nameA > nameB){
        return 1
      }
      return 0 // names are equal
    })
    console.log(this.cryptoBalance);
    
    // get image
    let allCoinsList = this.dataFetchingService.fetchCoinsList();
    if (allCoinsList && allCoinsList.length) {
      let count = 0;
      for (let coin of allCoinsList) {
        this.cryptoBalance.map((crypto) => {
          console.log(count, crypto);
          
          if (coin.name.toLowerCase() === crypto.name.toLowerCase()) {
            crypto.image = coin.image;
            count++;
          }
        });
        if (count >= allCoinsList.length) {
          break;
        }
      }
    }
    this.dataFetchingService.getRates(coinsInBalance, 'usd').subscribe(
      (res) =>
        this.cryptoBalance.map((crypto) => {
          Object.keys(res).forEach((key) => {
            if (key === crypto.name.toLowerCase()) {
              crypto.rateUSD = res[key as keyof object]['usd'];
            }
          });
          // calculate value of each hodling and calculate total
          if (crypto.rateUSD && crypto.amount) {
            crypto.valueUSD = crypto.rateUSD * crypto.amount;
          }
          if (crypto.valueUSD) {
            this.total += crypto.valueUSD;
          }
          // get the weight of each
          if (this.total && this.total > 0) {
            if (crypto.valueUSD) {
              crypto.weight = crypto.valueUSD / this.total;
            }
          }
        }),

      (error) => {
        console.log('error fetching rates');
      }
    );
  }

  addCoin(coin: Coin) {
    if (this.cryptoBalance.length >= this.maxNumberOfCoins) {
      return;
    }
    this.newCoin = coin;
    if (!coin.rateUSD) {
      console.log('getting rates');
      this.dataFetchingService
        .getRates([coin.id ? coin.id : coin.name.toLowerCase()], 'usd')
        .subscribe((rate) => {
          this.newCoin.rateUSD = Object.values(rate)[0]['usd'];
        });
    } else {
      this.newCoin.rateUSD = coin.rateUSD;
    }
    //console.log(this.newCoin);
    // calculate value
    if (this.newCoin.rateUSD && this.newCoin.amount) {
      this.newCoin.valueUSD = this.newCoin.rateUSD * this.newCoin.amount;
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
  // TODO get coin icons from coins list json file
  getCoinIcons() {}

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
