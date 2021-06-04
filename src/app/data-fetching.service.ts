import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Coin } from './balance/coin.model';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class DataFetchingService {
  // https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd
  private COINGECKO_URL: string = 'https://api.coingecko.com/api/v3';
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
    return this.http.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${name}&vs_currencies=usd`
    );
  }

  getRates(coinList: string[], currency: string) {
    // <{ [key: string]: { rate: number } }>
    // coingecko API is a GET request,     
    // returns {
    //   "bitcoin": {
    //     "usd": 37789
    //   }
    // }
    const formattedCoinListForAPI: string = coinList.join('%2C');

    return this.http.get(
      this.COINGECKO_URL +
        '/simple/price?ids=' +
        formattedCoinListForAPI +
        '&vs_currencies=' +
        currency.toLowerCase()
    );

    // bugged
    // let httpParams = new HttpParams()
    // .set('ids', formattedCoinListForAPI.toString())
    // .set('vs_currencies', 'usd');
    // return this.http.get(this.COINGECKO_URL + '/simple/price', {
    //   params: httpParams,
    // });
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
  searchCoinList(searchInput: string): Observable<Coin[]> {
    let result: Coin[] = [];
    if (!searchInput.trim()) {
      // if not search term, return emptyarray.
      return of([]);
    }
    return this.http.get<Coin[]>('./assets/coins-list.json').pipe(
      map((coinList) => {
        coinList.map((coin) => {
          if (coin && searchInput.trim().length > 1) {
            // partial match
            if (coin.id && coin.id.includes(searchInput.toLowerCase())) {
              result.push(coin);
            }
            if (coin.symbol.includes(searchInput.toLowerCase())) {
              result.push(coin);
            }
          }
        });
        return result;
      })
    );
  }

// NEWS fetching
// https://newsdata.io/api/1/news?apikey=YOUR_API_KEY&language=en&q=social%20AND%20pizza%20AND%20pasta
fetchNews(coins:string[]){
  const newsDataURL = 'https://newsdata.io/api/1/news?apikey=' + environment.apiNewsData
  let httpParams = new HttpParams()
  .set('language','en')
  .set('q',coins[0])
  return this.http.get(newsDataURL,{params:httpParams})
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
