import { AnyToken } from '~data/index';

export interface FundingSource {
  team: string;
  rate: {
    amount?: number;
    token?: string;
    time?: string;
  };
  isExpanded: boolean;
  limit?: number;
  id: string;
}

export interface Streaming {
  fundingSource: FundingSource[];
}

export interface FundingSourceLocked extends Omit<FundingSource, 'rate'> {
  rate: {
    amount?: number;
    token?: AnyToken;
    time?: string;
  };
}
