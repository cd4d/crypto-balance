import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { DataFetchingService } from 'src/app/data-fetching.service';
import { BalanceService } from '../balance.service';

import { Coin } from '../coin.model';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddCoinComponent } from './add-coin/add-coin.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-balance-list',
  templateUrl: './balance-list.component.html',
  styleUrls: ['./balance-list.component.css'],
})
export class BalanceListComponent implements OnInit, OnDestroy {
  constructor(
    private balanceService: BalanceService,
    private dataFetchingService: DataFetchingService,
    public dialogService: DialogService
  ) {}
  balance: Coin[] = [];
  // max nr of coins
  maxNumberOfCoins = 10;
  addCoinFormVisible = false;
  balanceChangedSub = new Subscription();
  // coin name to be added
  coinName: string = '';
  // first 10 coins
  columnsToDisplay: any[] = [];

  // steps for input
  minValue: number | undefined;
  maxValue: number | undefined;
  sliderStep: number | undefined;
  // for modal dialog
  ref: DynamicDialogRef | undefined;
  // pagination
  indexFirstCoin = 0;
  indexLastCoin = 5;
  // number of coins per page
  pageSize = 5;
  // outputting data to chart
  

  ngOnInit(): void {
    const receivedBalance = this.balanceService.getBalance();
    this.balance = this.balanceService.addSteps(receivedBalance);
    //this.balanceService.addRates()
    this.balanceService.calculateBalance();
    this.balanceChangedSub = this.balanceService.balanceChanged.subscribe(
      (newBalance) => {
        this.balance = this.balanceService.addSteps(newBalance);
        this.balanceService.calculateBalance();
      }
    );
    // TODO get news from list
  }

  toggleAddCoinVisibility = (): void => {
    this.addCoinFormVisible = !this.addCoinFormVisible;
  };

  onChangeAmount(ticker: string, value: number | null) {
    if (typeof value === 'number') {
      // if(value) returns 'false' for 0
      this.balanceService.changeAmount(ticker, value);
    }
  }
  onDeleteCoin(coin: Coin) {
    this.balanceService.deleteCoin(coin);
  }
  paginate(event: { first: number; rows: number }) {
    //event.first = Index of the first record
    //event.rows = Number of rows to display in new page
    //event.page = Index of the new page
    //event.pageCount = Total number of pages
    this.indexFirstCoin = event.first;
    this.indexLastCoin = event.first + event.rows;
    console.log(event);

    console.log(this.indexFirstCoin);
    console.log(this.indexLastCoin);
  }

  ngOnDestroy() {
    if (this.ref) {
      this.ref.close();
    }
  }
}
