export interface Batch {
  amount: { value?: string; tokenAddress?: string };
  data?: {
    recipient?: string;
    amount?: number;
    token?: string;
  }[];
}

export interface BatchDataItem {
  recipient: string;
  token: string;
  amount: string;
}
