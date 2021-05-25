export class CryptoCurrency {
  constructor(
    public name: string, // Bitcoin
    public ticker: string, // BTC
    public rateUSD: number, // 1? 100? 1000000?
    public amount: number, // 0.5
    public valueUSD?: number, // 0.5? 50? 500000? 
    public weight?: number, // x% of the total
    public subUnit?: string, // Satoshi
    public subUnitToUnit?: number // 100000000 (1BTC = 100000000 Satoshis)
  ) {}
}
