import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DataFetchingService } from 'src/app/data-fetching.service';
import { BalanceService } from '../balance.service';
import { CryptoCurrency } from '../crypto-currency.model';

import { Coin } from '../coin.model';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddCoinComponent } from './add-coin/add-coin.component';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

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
  balance: CryptoCurrency[] = [];
  addCoinFormVisible = false;
  // coin name to be added
  coinName: string = '';
  // first 10 coins
  coinList: Coin[] = [];
  columnsToDisplay: any[] = [];

  // steps for input
  minValue: number | undefined;
  maxValue: number | undefined;
  sliderStep: number | undefined;
  // for modal dialog
  ref: DynamicDialogRef | undefined;
  @Input() cryptoCurrency: CryptoCurrency = {
    name: '',
    ticker: '',
    rateUSD: 0,
    amount: 0,
  };
  coins$!: Observable<Coin[]>;
  private searchTerms = new Subject<string>();

  ngOnInit(): void {
    const receivedBalance = this.balanceService.getBalance();
    this.balance = this.balanceService.addSteps(receivedBalance);
    this.balanceService.calculateBalance();


    this.coins$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.dataFetchingService.searchCoinList(term)),
    );


  }

  // Push a search term into the observable stream.
  searchCoin(term: string): void {
    this.searchTerms.next(term);
  }

  toggleAddCoin = (): void => {
    this.addCoinFormVisible = !this.addCoinFormVisible;
  };

  onAddCoin() {
    this.dataFetchingService.fetchCoinsList();
    this.coinList = this.dataFetchingService.coinList.slice(0, 10);
    this.ref = this.dialogService.open(AddCoinComponent, {
      data: {
        test: 'something',
      },
      header: 'Add a coin',
      width: '70%',
      contentStyle: { 'max-height': '500px', overflow: 'auto' },
      baseZIndex: 10000,
    });
  }
  onChangeAmount(ticker: string, value: number | null) {
    if (typeof value === 'number') {
      // if(value) returns 'false' for 0
      this.balanceService.changeAmount(ticker, value);
    }
  }
  ngOnDestroy() {
    if (this.ref) {
      this.ref.close();
    }
  }
}
