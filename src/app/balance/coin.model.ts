// based on coingecko data format
export class Coin {
  constructor(
    public name: string, // Bitcoin
    public symbol: string, // BTC
    public id?: string, // bitcoin
    public rateUSD?: number, // 1? 100? 1000000?
    public amount?: number, // 0.5
    public valueUSD?: number, // 0.5? 50? 500000? 
    public weight?: number, // x% of the total
    public subUnit?: string, // Satoshi
    public subUnitToUnit?: number, // 100000000 (1BTC = 100000000 Satoshis)
    public minValue?:number,
    public maxValue?:number,
    public editStep?:number, // increase/decrease amount by how much in the UI i.e increase bitcoin by 0.001 and Tether by 1 
    public image?: string,
    public current_price?: number, // 34899
    public market_cap?: number, //654769644270,
    public market_cap_rank?: number, //1,
    public fully_diluted_valuation?:number, // 734460339860,
    public total_volume?:number, //  43329911313,
    public high_24h?:number, //  37389,
    public low_24h?:number, //  33749,
    public price_change_24h?:number, //  -941.06337141,
    public price_change_percentage_24h?:number, //  -2.62573,
    public market_cap_change_24h?:number, //  -13670856974.901855,
    public market_cap_change_percentage_24h?:number, //  -2.04519,
    public circulating_supply?:number, //  18721450,
    public total_supply?:number, //  21000000,
    public max_supply?:number, //  21000000,
    public ath?:number, //  64805,
    public ath_change_percentage?:number, //  -46.03124,
    public ath_date?:Date, //  "2021-04-14T11:54:46.763Z",
    public atl?:number, //  67.81,
    public atl_change_percentage?:number, //  51477.66948,
    public atl_date?:number, //  "2013-07-06T00:00:00.000Z",
    public roi?:number, //  null,
    public last_updated?:Date, //  "2021-05-29T23:43:03.889Z"
  
  
    ) {}
}
