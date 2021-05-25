import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { BalanceComponent } from './balance/balance.component';
import { BalanceListComponent } from './balance/balance-list/balance-list.component';
import { BalanceChartsComponent } from './balance/balance-charts/balance-charts.component';
import { NgxChartsModule } from "@swimlane/ngx-charts";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BalanceComponent,
    BalanceListComponent,
    BalanceChartsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxChartsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
