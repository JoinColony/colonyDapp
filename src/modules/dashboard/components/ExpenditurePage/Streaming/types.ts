export interface FundingSource {
  team: string;
  rate: {
    amount?: number;
    token?: string;
    time?: string;
    id: string;
  };
  isExpanded: boolean;
  limit?: number;
  id: string;
}

export interface Streaming {
  fundingSources: FundingSource[];
}
