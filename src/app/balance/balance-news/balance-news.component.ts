import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataFetchingService } from 'src/app/data-fetching.service';
import { BalanceService } from '../balance.service';
import { Coin } from '../coin.model';
import { newsElement } from './news.model';
@Component({
  selector: 'app-balance-news',
  templateUrl: './balance-news.component.html',
  styleUrls: ['./balance-news.component.css'],
})
export class BalanceNewsComponent implements OnInit, OnDestroy {
  balance: Coin[] = [];
  coinsList: string[] = [];
  newsData: newsElement[] = [];
  balanceChangedSub = new Subscription();
  indexFirstNews: number = 0;
  newsPerPage: number = 3;
  indexLastNews: number = 3;
  isLoading = false;
  error: string = '';
  constructor(
    private balanceService: BalanceService,
    private dataFetchingService: DataFetchingService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.balance = this.balanceService.getBalance();
    this.coinsList = this.balance.map((crypto) => crypto.name);
    console.log('coinslist init: ', this.coinsList);

    this.balanceChangedSub = this.balanceService.balanceChanged.subscribe(
      (receivedBalance) => {
        this.coinsList = receivedBalance.map((crypto) => crypto.name);
        console.log('coinslist sub: ', this.coinsList);
      }
    );
    this.http
      .get<{ value: newsElement[] }>('./assets/sample-news.json')
      .subscribe((data) => {
        if (data.value) {
          this.newsData = data.value;
        }
      });

    //   this.dataFetchingService
    //     .fetchNews(this.coinsList)
    //     .subscribe((data) => (this.newsData = data));
    //   console.log(this.newsData);
  }
  refreshNews() {
    this.error = ''; // resetting error
    console.log('refreshing news from: ', this.coinsList);
    this.isLoading = true;
    this.dataFetchingService.fetchNews(this.coinsList).subscribe(
      (data) => {
        if (data.value) {
          this.newsData = data.value;
        }
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        console.log(error);
        if (error.statusText) {
          this.error = error.statusText;
        } else {
          this.error = 'Error fetching news.';
        }
      }
    );
  }
  paginate(event: { first: number; rows: number }) {
    //event.first = Index of the first record
    //event.rows = Number of rows to display in new page
    //event.page = Index of the new page
    //event.pageCount = Total number of pages
    this.indexFirstNews = event.first;
    this.indexLastNews = event.first + event.rows;
  }
  onCloseError() {
    this.error = '';
  }
  ngOnDestroy() {
    this.balanceChangedSub.unsubscribe();
  }
}
