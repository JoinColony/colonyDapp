export interface Recipient {
  id?: string;
  recipient?: AnyUser;
  value?: { amount?: number; tokenAddress?: number }[];
  delay?: {
    amount: string;
    time: string;
  };
  isExpanded?: boolean;
}
