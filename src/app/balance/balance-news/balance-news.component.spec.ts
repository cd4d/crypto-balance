import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceNewsComponent } from './balance-news.component';

describe('BalanceNewsComponent', () => {
  let component: BalanceNewsComponent;
  let fixture: ComponentFixture<BalanceNewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BalanceNewsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BalanceNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
