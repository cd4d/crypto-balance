import { Component, OnInit } from '@angular/core';

import { DataFetchingService } from './data-fetching.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'crypto-balance';
  constructor(private dataFetchingService: DataFetchingService) {}

  ngOnInit() {
    //check coins  list: save if no file or update it if file older than 1 month
  }
}
