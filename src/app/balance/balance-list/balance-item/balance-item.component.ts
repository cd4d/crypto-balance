import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatSlider } from '@angular/material/slider';
import { Subject, Subscription } from 'rxjs';
import { BalanceService } from '../../balance.service';
import { CryptoCurrency } from '../../crypto-currency.model';

@Component({
  selector: 'app-balance-item',
  templateUrl: './balance-item.component.html',
  styleUrls: ['./balance-item.component.css'],
})
export class BalanceItemComponent implements OnInit {
  constructor(private balanceService: BalanceService) {}

  @Input() cryptoCurrency: CryptoCurrency = {
    name: '',
    ticker: '',
    rateUSD: 0,
    amount: 0,
  };

  ngOnInit() {

  }


  onSlide(ticker: string, value: number | null) {
    if (value) {
      this.balanceService.changeAmount(ticker, value);
    };

    
  }

}
