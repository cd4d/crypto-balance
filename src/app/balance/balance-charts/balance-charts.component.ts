import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BalanceService } from '../balance.service';
import { Coin } from '../coin.model';

@Component({
  selector: 'app-balance-charts',
  templateUrl: './balance-charts.component.html',
  styleUrls: ['./balance-charts.component.css'],
})
export class BalanceChartsComponent implements OnInit, OnDestroy {
  constructor(private balanceService: BalanceService) {}
  balance: Coin[] = [];
  balanceChangedSub = new Subscription();
  // ngx charts options
  data: any[] = [];
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  view: [number, number] = [700, 400];
  valueFormatting(value: number) {
    return '$' + value.toLocaleString();
  }

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };

  ngOnInit(): void {
    this.balance = this.balanceService.getBalance();
    // Subscribe to update crypto data
    this.balanceChangedSub = this.balanceService.balanceChanged.subscribe(
      (receivedBalance) => {
        this.data = []
        receivedBalance.forEach((crypto) => {
          const formattedCrypto = this.formatChartData(crypto);
          this.data.push(formattedCrypto)
        });
      }
    );
    // initialize chart data
    this.balance.forEach((crypto) => {
      const newCrypto = this.formatChartData(crypto);
      this.data.push(newCrypto);
    });
  }
  formatChartData(crypto: Coin) {
    // format data to ngx-chart
    let newCrypto = { name: '', value: 0, label: '' };
    newCrypto.name = crypto.name;
    newCrypto.value = crypto.valueUSD ? crypto.valueUSD : 0;
    return newCrypto;
  }
  ngOnDestroy() {
    this.balanceChangedSub.unsubscribe();
  }
}
