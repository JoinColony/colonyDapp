export interface FundingSource {
  team: string;
  rate: {
    amount?: number;
    token?: string;
    time?: string;
    limit?: number;
    id: string;
  }[];
  isExpanded: boolean;
  id: string;
}

export interface Streaming {
  fundingSource: FundingSource[];
}

export enum TimePeriod {
  Month = 'month',
  Week = 'week',
  Day = 'day',
  Hour = 'hour',
}
