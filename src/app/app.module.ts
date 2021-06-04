import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { BalanceComponent } from './balance/balance.component';
import { BalanceListComponent } from './balance/balance-list/balance-list.component';
import { BalanceChartsComponent } from './balance/balance-charts/balance-charts.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DialogService } from 'primeng/dynamicdialog';
import { AddCoinComponent } from './balance/balance-list/add-coin/add-coin.component';
import { InputTextModule } from 'primeng/inputtext';
import { BalanceNewsComponent } from './balance/balance-news/balance-news.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BalanceComponent,
    BalanceListComponent,
    BalanceChartsComponent,
    AddCoinComponent,
    BalanceNewsComponent,
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
    InputTextModule
  ],

  providers: [ConfirmationService, DialogService],
  bootstrap: [AppComponent],
})
export class AppModule {}
