import { Component, OnInit } from '@angular/core';
import { BalanceService } from '../balance.service';
import { CryptoCurrency } from '../crypto-currency.model';

@Component({
  selector: 'app-balance-charts',
  templateUrl: './balance-charts.component.html',
  styleUrls: ['./balance-charts.component.css']
})
export class BalanceChartsComponent implements OnInit {

  constructor(private balanceService: BalanceService) { }
  data:any[] = []
   // ngx charts options
   gradient: boolean = true;
   showLegend: boolean = true;
   showLabels: boolean = true;
   isDoughnut: boolean = false;
   view: [number,number] = [700, 400];
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  ngOnInit(): void {
    this.balanceService.calculateBalance().forEach(crypto =>{
      let element = {name:"",value:0}
       element.name = crypto.name
       element.value = crypto.valueUSD ? crypto.valueUSD : 0
       console.log(element);
       this.data.push(element)
    }
    )
    console.log(this.data);
    
    //this.balanceService.calculateBalance()
  }

}
