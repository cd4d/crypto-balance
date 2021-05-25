export class CryptoCurrency {
  constructor(
    public name: string, // Bitcoin
    public ticker: string, // BTC
    public valueUSD: number, // 1? 100? 1000000?
    public amount: number, // 0.5
    // public subUnit: string, // Satoshi
    // public subUnitToUnit: number // 100000000 (1BTC = 100000000 Satoshis)
  ) {}
}
