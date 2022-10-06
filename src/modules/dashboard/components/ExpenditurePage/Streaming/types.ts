export interface Rate {
  amount?: number;
  token?: string;
  time?: string;
  limit?: number;
  id: string;
}

export interface FundingSource {
  team: string;
  rate: Rate[];
  isExpanded: boolean;
  id: string;
}

export interface Streaming {
  fundingSources: FundingSource[];
}

export enum TimePeriod {
  Month = 'month',
  Week = 'week',
  Day = 'day',
  Hour = 'hour',
}
