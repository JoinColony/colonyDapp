export interface Recipient {
  id?: string;
  recipient: AnyUser;
  value: { id: string; amount?: string; tokenAddress?: string }[];
  delay: {
    amount: string;
    time: string;
  };
  isExpanded?: boolean;
  claimDate?: number;
  claimed?: boolean;
}
