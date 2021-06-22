import { CurrencyPipe } from '@angular/common';
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
    private dataFetchingService: DataFetchingService,
    private currencyPipe: CurrencyPipe
  ) { }
  balance: Coin[] = [];
  balanceChangedSub = new Subscription();
  currencyChangedSub = new Subscription();
  selectedCurrency = this.balanceService.getSelectedCurrency()

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
    //let currencyFormatted = this.currencyPipe.transform(this.selectedCurrency.toUpperCase())
    return this.currencyPipe.transform(value, this.selectedCurrency.toUpperCase())
  }

  colorScheme = {
    domain: ['#007bff', '#FF6384', '#FFCE56', '#AAAAAA'],
  };

  ngOnInit(): void {
    console.log(this.currencyPipe.transform(90, this.selectedCurrency.toUpperCase()));

    // initialize chart data
    const currentBalance = this.balanceService.getBalance()
    let coinsList = currentBalance.map((coin) => coin.name);
    this.dataFetchingService.getRates(coinsList, 'usd').subscribe((res) =>
      currentBalance.map((crypto) => {
        Object.keys(res).forEach((key) => {
          if (key === crypto.name.toLowerCase()) {
            crypto.rate = res[key as keyof object]['usd'];
          }
        });
        // calculate value of each hodling and calculate total
        if (crypto.rate && crypto.amount) {
          crypto.value = crypto.rate * crypto.amount;
        }
        if (crypto.value) {
          this.total += crypto.value;
        }
        // get the weight of each
        if (this.total && this.total > 0) {
          if (crypto.value) {
            crypto.weight = crypto.value / this.total;
          }
        }
      }

      ), error => { console.log('error') },
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
    // watch currency changes
    this.currencyChangedSub = this.balanceService.currencyChanged.subscribe(newCurrency => {
      this.selectedCurrency = newCurrency
      console.log("currency changed chart: ", this.selectedCurrency);

    })

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
    newCrypto.value = crypto.value ? crypto.value : 0;

    return newCrypto;
  }
  // primeNG chart version
  // formatChartData(crypto: Coin) {
  //   // format data to ngx-chart
  //   let newCrypto = { name: '', value: 0, label: '' };
  //   newCrypto.name = crypto.name;
  //   newCrypto.value = crypto.value ? crypto.value : 0;

  //   return newCrypto;
  // }
  // updateChartData(receivedBalance: Coin[]) {
  //   // update and format chart data
  //   this.data = {labels:[],datasets:[{data:[]}]}
  //   receivedBalance.map((crypto) => {
  //     this.data.labels.push(crypto.name)
  //     this.data.datasets[0].data.push(crypto.value ? crypto.value : 0)
  //   });
  //   console.log(this.data);

  // }

  ngOnDestroy() {
    this.balanceChangedSub.unsubscribe();
    this.currencyChangedSub.unsubscribe()
  }
}
