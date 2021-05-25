import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { BalanceComponent } from './balance/balance.component';
import { BalanceListComponent } from './balance/balance-list/balance-list.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BalanceComponent,
    BalanceListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
