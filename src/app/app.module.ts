import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { BalanceComponent } from './balance/balance.component';
import { BalanceListComponent } from './balance/balance-list/balance-list.component';
import { BalanceChartsComponent } from './balance/balance-charts/balance-charts.component';
import { BalanceNewsComponent } from './balance/balance-news/balance-news.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DialogService } from 'primeng/dynamicdialog';
import { AddCoinComponent } from './balance/balance-list/add-coin/add-coin.component';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { TruncatePipe } from './shared/truncate.pipe';
import { PaginatorModule } from 'primeng/paginator';
import { ChartModule } from 'primeng/chart';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BalanceComponent,
    BalanceListComponent,
    BalanceChartsComponent,
    AddCoinComponent,
    BalanceNewsComponent,
    TruncatePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxChartsModule,
    FormsModule,
    HttpClientModule,
    // PrimeNG
    TableModule,
    ConfirmDialogModule,
    DynamicDialogModule,
    InputTextModule,
    CardModule,
    PaginatorModule,
    ChartModule
  ],

  providers: [ConfirmationService, DialogService],
  bootstrap: [AppComponent],
})
export class AppModule { }
