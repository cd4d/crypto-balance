import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Coin } from './balance/coin.model';
@Injectable({
  providedIn: 'root',
})
export class DataFetchingService {
  // https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd
  private COINGECKO_URL = 'https://api.coingecko.com/api/v3';
  coinList: Coin[] = [];

  constructor(private http: HttpClient) {}
  getCoinList() {
    // return this.http.get<Coin[]>(this.COINGECKO_URL + '/coins/list', {
    //   params: new HttpParams().set('include_platform', 'false'),
    // });
    // grab the list from local file instead
    return this.http.get<[]>('./assets/coins-list.json');
  }
  fetchOneCryptoCurrency(name: string) {
    this.http
      .get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${name}&vs_currencies=usd`
      )
      .subscribe((res) => console.log(res));
  }

  fetchCoinsList() {
    if (!localStorage.getItem('coinsList')) {
      console.log('fetching remotely coin list');
      this.getCoinList().subscribe((coins) => {
        this.coinList = coins;
        localStorage.setItem('coinsList', JSON.stringify(coins));
      });
    } else {
      // get coin list from localstorage
      console.log('getting coin list from localstorage');
      const localCoinsList = localStorage.getItem('coinsList');
      if (localCoinsList !== null) {
        this.coinList = JSON.parse(localCoinsList);
      }
    }
    return this.coinList;
  }
  searchCoinList(searchedCoin: string): Observable<Coin[]> {
    console.log('searching coin: ' + searchedCoin);

    let result: Coin[] = []
    if (!searchedCoin.trim()) {
      // if not search term, return empty  coin.
      return of([{ id: '', name: '', symbol: '' }]);
    }
    return this.http.get<Coin[]>('./assets/coins-list.json').pipe(
      map((coinList) => {
        coinList.map((coin) => {
          if (coin && coin.id === searchedCoin.toLowerCase()) {
            result.push(coin)
          }
        });        
        return result
      })
    );
    // const coinList = this.fetchCoinsList();
    // if (coinList) {
    //   coinList.map((coin) => {
    //     if (coin.id === searchedCoin.toLowerCase()) {
    //       console.log("coin found: ", coin);

    //       return coin;
    //     }
    //     return null;
    //   });
    // }
  }
}

// Response sample for BTC:

// {
//   "id": "bitcoin",
//   "symbol": "btc",
//   "name": "Bitcoin",
//   "image": "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579",
//   "current_price": 39124,
//   "market_cap": 728740754929,
//   "market_cap_rank": 1,
//   "fully_diluted_valuation": 817506113765,
//   "total_volume": 43400432709,
//   "high_24h": 40433,
//   "low_24h": 37359,
//   "price_change_24h": 589.49,
//   "price_change_percentage_24h": 1.52976,
//   "market_cap_change_24h": 8692225486,
//   "market_cap_change_percentage_24h": 1.20717,
//   "circulating_supply": 18719806,
//   "total_supply": 21000000,
//   "max_supply": 21000000,
//   "ath": 64805,
//   "ath_change_percentage": -39.92897,
//   "ath_date": "2021-04-14T11:54:46.763Z",
//   "atl": 67.81,
//   "atl_change_percentage": 57309.58068,
//   "atl_date": "2013-07-06T00:00:00.000Z",
//   "roi": null,
//   "last_updated": "2021-05-27T17:28:14.026Z"
// }
