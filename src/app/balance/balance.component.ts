import { Component, OnInit } from '@angular/core';
import { DataFetchingService } from '../data-fetching.service';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css'],
})
export class BalanceComponent implements OnInit {
  constructor(private dataFetchingService:DataFetchingService) {}

  ngOnInit(): void {
  }
  onFetchOneCrypto(){
    this.dataFetchingService.fetchOneCryptoCurrency('bitcoin')
  }
  onSearchBTC(){
    console.log(this.dataFetchingService.searchCoinList("Bitcoin"))
  }
}
