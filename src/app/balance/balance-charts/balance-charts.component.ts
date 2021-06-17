import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Component,
  DoCheck,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { DataFetchingService } from 'src/app/data-fetching.service';
import { BalanceService } from '../balance.service';
import { Coin } from '../coin.model';

@Component({
  selector: 'app-balance-charts',
  templateUrl: './balance-charts.component.html',
  styleUrls: ['./balance-charts.component.css'],
})
export class BalanceChartsComponent implements OnInit, OnDestroy {
  constructor(
    private balanceService: BalanceService,
    private dataFetchingService: DataFetchingService
  ) {}
  balance: Coin[] = [];
  balanceChangedSub = new Subscription();
  total: number = 0;
  // primeNG chart
  // data: {labels:string[],datasets:[{data:number[]}]} = {labels:[],datasets:[{data:[]}]};
  // ngx charts options
  data: any[] = [];
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  // Using dynamic size instead: https://github.com/swimlane/ngx-charts/issues/1096
  // view: [number, number] = [700, 300];

  valueFormatting(value: number) {
    return '$' + value.toLocaleString();
  }

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };

  ngOnInit(): void {
  
    // works
    const currentBalance = this.balanceService.getBalance()
    let coinsList = currentBalance.map((coin) => coin.name);
    this.dataFetchingService.getRates(coinsList, 'usd').subscribe((res) =>
      currentBalance.map((crypto) => {
        Object.keys(res).forEach((key) => {
          if (key === crypto.name.toLowerCase()) {
            crypto.rateUSD = res[key as keyof object]['usd'];
          }
        });
        // calculate value of each hodling and calculate total
        if (crypto.rateUSD && crypto.amount) {
          crypto.valueUSD = crypto.rateUSD * crypto.amount;
        }
        if (crypto.valueUSD) {
          this.total += crypto.valueUSD;
        }
        // get the weight of each
        if (this.total && this.total > 0) {
          if (crypto.valueUSD) {
            crypto.weight = crypto.valueUSD / this.total;
          }
        }
      }

      ),error => {console.log('error')},
      () => {
        
      this.data = this.updateChartData(currentBalance)
      }

    );

    // Subscribe to update crypto data
    this.balanceChangedSub = this.balanceService.balanceChanged.subscribe(
      (receivedBalance) => {
        this.data = [];
        this.data = this.updateChartData(receivedBalance);
      }
    );
  }

  updateChartData(receivedBalance: Coin[]) {
    // update and format chart data
    let newData: any[] = [];
    receivedBalance.map((crypto) => {
      const newCrypto = this.formatChartData(crypto);
      newData.push(newCrypto);
      //this.data.push(newCrypto);
    });
    return newData;
  }
  // ngx-charts version
  formatChartData(crypto: Coin) {
    // format data to ngx-chart
    let newCrypto = { name: '', value: 0, label: '' };
    newCrypto.name = crypto.name;
    newCrypto.value = crypto.valueUSD ? crypto.valueUSD : 0;

    return newCrypto;
  }
  // primeNG chart version
  // formatChartData(crypto: Coin) {
  //   // format data to ngx-chart
  //   let newCrypto = { name: '', value: 0, label: '' };
  //   newCrypto.name = crypto.name;
  //   newCrypto.value = crypto.valueUSD ? crypto.valueUSD : 0;

  //   return newCrypto;
  // }
  // updateChartData(receivedBalance: Coin[]) {
  //   // update and format chart data
  //   this.data = {labels:[],datasets:[{data:[]}]}
  //   receivedBalance.map((crypto) => {
  //     this.data.labels.push(crypto.name)
  //     this.data.datasets[0].data.push(crypto.valueUSD ? crypto.valueUSD : 0)
  //   });
  //   console.log(this.data);

  // }

  ngOnDestroy() {
    this.balanceChangedSub.unsubscribe();
  }
}
