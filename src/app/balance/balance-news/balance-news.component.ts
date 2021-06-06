import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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

export class BalanceNewsComponent implements
  OnInit {
  balance: Coin[] = [];
  coinsList: string[] = [];
  newsData: newsElement[] = []
  balanceChangedSub = new Subscription();
  indexFirstNews: number = 0
  newsPerPage: number = 0
  indexLastNews: number = 3

  constructor(
    private balanceService: BalanceService,
    private dataFetchingService: DataFetchingService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.balance = this.balanceService.getBalance();
    this.coinsList = this.balance.map((crypto) => crypto.name);
    this.balanceService.balanceChanged.pipe(
      map((receivedBalance) => {
        this.coinsList = receivedBalance.map((crypto) => crypto.name);
      })
    );
    this.http.get<{ value: newsElement[] }>('./assets/sample-news.json').subscribe(
      (data) => {
        if (data.value) {
          this.newsData = data.value;

        }
        console.log(this.newsData);
      }
    );

    //   this.dataFetchingService
    //     .fetchNews(this.coinsList)
    //     .subscribe((data) => (this.newsData = data));
    //   console.log(this.newsData);
  }
  refreshNews() {    
    this.dataFetchingService.fetchNews(this.coinsList).subscribe(data => {
      if (data.value) {
        this.newsData = data.value;
      }
    })
  }
  paginate(event: { first: number; rows: number; }) {
    //event.first = Index of the first record
    //event.rows = Number of rows to display in new page
    //event.page = Index of the new page
    //event.pageCount = Total number of pages
    this.indexFirstNews = event.first
    this.indexLastNews = event.first + event.rows
    console.log(event);

    console.log(this.indexFirstNews);
    console.log(this.indexLastNews);


  }
}
