import { CryptoCurrency } from './crypto-currency.model';

describe('CryptoCurrency', () => {
  it('should create an instance', () => {
    expect(new CryptoCurrency()).toBeTruthy();
  });
});
