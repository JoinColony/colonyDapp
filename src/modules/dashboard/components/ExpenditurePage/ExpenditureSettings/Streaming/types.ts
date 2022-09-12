import { AnyToken } from '~data/index';

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

export interface FundingSourceLocked extends Omit<FundingSource, 'rate'> {
  rate: {
    amount?: number;
    token?: AnyToken;
    time?: string;
  };
}
