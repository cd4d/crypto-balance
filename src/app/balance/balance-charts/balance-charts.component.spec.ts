import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceChartsComponent } from './balance-charts.component';

describe('BalanceChartsComponent', () => {
  let component: BalanceChartsComponent;
  let fixture: ComponentFixture<BalanceChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BalanceChartsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BalanceChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
