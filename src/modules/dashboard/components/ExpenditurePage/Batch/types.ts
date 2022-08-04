export interface Batch {
  amount: { value?: string; tokenAddress?: string };
  data?: {
    id: string;
    recipient?: string;
    amount?: number;
    token?: string;
  }[];
}
