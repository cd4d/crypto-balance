import { Component, Input, OnInit } from '@angular/core';
import { DataFetchingService } from 'src/app/data-fetching.service';
import { BalanceService } from '../balance.service';
import { CryptoCurrency } from '../crypto-currency.model';

import { Coin } from '../coin.model';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AddCoinComponent } from './add-coin/add-coin.component';

@Component({
  selector: 'app-balance-list',
  templateUrl: './balance-list.component.html',
  styleUrls: ['./balance-list.component.css'],
})
export class BalanceListComponent implements OnInit {
  constructor(
    private balanceService: BalanceService,
    private dataFetchingService: DataFetchingService,
    public dialogService: DialogService
  ) {}
  balance: CryptoCurrency[] = [];
  // coin name to be added
  coinName: string = '';
  // first 10 coins
  coinList: Coin[] = [];
  columnsToDisplay: any[] = [];

  // steps for input
  minValue: number | undefined;
  maxValue: number | undefined;
  sliderStep: number | undefined;
  @Input() cryptoCurrency: CryptoCurrency = {
    name: '',
    ticker: '',
    rateUSD: 0,
    amount: 0,
  };
  ngOnInit(): void {
    const receivedBalance = this.balanceService.getBalance();
    this.balance = this.balanceService.addSteps(receivedBalance);
    this.balanceService.calculateBalance();
    console.log(this.balance);
    this.columnsToDisplay = [
      { field: 'name', header: 'Name' },
      { field: 'ticker', header: 'Ticker' },
      { field: 'rateUSD', header: 'Price (USD)' },
      { field: 'amount', header: 'Amount' },
      { field: 'valueUSD', header: 'Value (USD)' },
    ];
  }
  onAddCoin() {
    this.dataFetchingService.fetchCoinsList();
    this.coinList = this.dataFetchingService.coinList.slice(0, 10);
    const ref = this.dialogService.open(AddCoinComponent, {
      data: {
        test: 'something',
      },
      header: 'this is a test',
      width: '70%',
    });
  }
  onChangeAmount(ticker: string, value: number | null) {
    if (typeof value === 'number') {
      // if(value) returns 'false' for 0
      this.balanceService.changeAmount(ticker, value);
    }
  }
}

// onAddCoin() {
//   this.dataFetchingService.fetchCoinsList();
//   this.coinList = this.dataFetchingService.coinList.slice(0, 10);
//   // open Modal
//   const dialogref = this.dialog.open(ModalAddCoin, {
//     width: '250px',
//     data: { coinName: this.coinName, coinList: this.coinList },
//   });
// }
// Material modal component
// @Component({
//   selector: 'modal-add-coin',
//   templateUrl: './modal-add-coin.html',
// })
// export class ModalAddCoin implements OnInit{
//   constructor(
//     public dialogref: MatDialogRef<ModalAddCoin>,
//     @Inject(MAT_DIALOG_DATA) public data: BalanceListComponent

//   ) {}
// ngOnInit(){
//   console.log(this.data);

// }
//   onClose() {
//     this.dialogref.close();
//   }
// }
