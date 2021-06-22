import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { DataFetchingService } from 'src/app/data-fetching.service';
import { BalanceService } from '../../balance.service';
import { Coin } from '../../coin.model';
@Component({
  selector: 'app-add-coin',
  templateUrl: './add-coin.component.html',
  styleUrls: ['./add-coin.component.css'],
})
export class AddCoinComponent implements OnInit, OnDestroy {
  @Input() onToggleAddCoinVisibility!: () => void;
  @Input() onSearchCoin!: (input: string) => void;
  private searchTerms = new Subject<string>();
  selectedCoin: Coin = { name: '', symbol: '', id: '', rate: 0 };
  coins$!: Observable<Coin[]>;
  error: string = ''
  currencyChangedSub = new Subscription();
  selectedCurrency = 'usd'
  constructor(
    private balanceService: BalanceService,
    private dataFetchingService: DataFetchingService // public ref: DynamicDialogRef, public config: DynamicDialogConfig
  ) { }

  ngOnInit(): void {
    // Search coin
    // The $ is a convention that indicates coins$ is an Observable, not an array.
    this.coins$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.dataFetchingService.searchCoinList(term))
    );

    // watch currency changes
    this.currencyChangedSub = this.balanceService.currencyChanged.subscribe(newCurrency => {
      this.selectedCurrency = newCurrency
      //console.log("currency changed add coin: ",this.selectedCurrency);

    })

  }
  // Push a search term into the observable stream.
  searchCoin(term: string): void {
    this.searchTerms.next(term);
  }
  selectCoin(coin: Coin) {
    this.selectedCoin = coin;
    // get the rate of selected coin
    this.dataFetchingService
      .getRates([coin.id ? coin.id : coin.name.toLowerCase()], this.selectedCurrency)
      .subscribe((res) => {
        Object.keys(res).forEach((key) => {
          // https://fettblog.eu/typescript-better-object-keys/
          this.selectedCoin.rate = res[key as keyof object][this.selectedCurrency];
        });
      }, error => {
        if (error.statusText) { this.error = error.statusText }
        else {
          this.error = 'Error getting rate.'
        }
      });

    // empty the resulting array by passing empty value
    this.searchTerms.next('');
    //console.log('selected coin ', this.selectedCoin);
  }
  onAddCoin() {
    if (this.selectedCoin.name && this.selectedCoin.amount) {
      //console.log('added coin ', this.selectedCoin.name, this.selectedCoin.amount, this.selectedCoin.rate);

      this.balanceService.addCoin(this.selectedCoin);
      this.onCloseInput()
    }
  }
  onCloseInput() {
    // reset selected coin and error message
    this.selectedCoin = { name: '', symbol: '', id: '', rate: 0, amount: 0 };
    this.error = ''
    this.onToggleAddCoinVisibility();
  }

  onChangeAmount(amount: string) {
    if (amount) {
      // convert string to number
      this.selectedCoin.amount = +amount;
    }
  }
  ngOnDestroy() {
    this.searchTerms.unsubscribe();
    this.currencyChangedSub.unsubscribe()
  }
}
