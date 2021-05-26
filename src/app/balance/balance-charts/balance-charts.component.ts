import { Component, OnInit } from '@angular/core';
import { BalanceService } from '../balance.service';
import { CryptoCurrency } from '../crypto-currency.model';

@Component({
  selector: 'app-balance-charts',
  templateUrl: './balance-charts.component.html',
  styleUrls: ['./balance-charts.component.css'],
})
export class BalanceChartsComponent implements OnInit {
  constructor(private balanceService: BalanceService) {}
  balance: CryptoCurrency[] = [];

  data: any[] = [];
  // ngx charts options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  view: [number, number] = [700, 400];
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };
  ngOnInit(): void {
    this.balance = this.balanceService.getBalance();

    // Subscribe to update crypto data
    this.balanceService.balanceChanged.subscribe((receivedBalance) => {

      receivedBalance.forEach((crypto) => {
        const newCrypto = this.updateData(crypto);
        this.data = this.data.map((el) => {
          if (el.name === newCrypto.name) {
            el = newCrypto;
          }
          return el;
        });
      });
    });

    this.balance.forEach((crypto) => {
      const newCrypto = this.updateData(crypto);

      this.data.push(newCrypto);
    });
  }
  updateData(crypto: CryptoCurrency) {
    let newCrypto = { name: '', value: 0 };
    newCrypto.name = crypto.name;
    newCrypto.value = crypto.valueUSD ? crypto.valueUSD : 0;
    return newCrypto;
  }
}
