export interface Recipient {
  id?: string;
  user: AnyUser;
  value: { id: string; amount?: number; tokenAddress?: number }[];
  delay: {
    amount: string;
    time: string;
  };
  isExpanded?: boolean;
}
