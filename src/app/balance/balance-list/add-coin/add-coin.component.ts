import { Component, OnInit } from '@angular/core';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';
import { BalanceService } from '../../balance.service';
@Component({
  selector: 'app-add-coin',
  templateUrl: './add-coin.component.html',
  styleUrls: ['./add-coin.component.css']
})
export class AddCoinComponent implements OnInit {

  constructor(private balanceService:BalanceService,
    public ref: DynamicDialogRef, public config: DynamicDialogConfig
    ) { }

  ngOnInit(): void {
  }

}
