export interface Recipient {
  id?: string;
  user: AnyUser;
  value: { amount?: number; tokenAddress?: number }[];
  delay: {
    amount: string;
    time: string;
  };
  isExpanded?: boolean;
}
