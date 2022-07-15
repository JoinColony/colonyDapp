export interface Recipient {
  id?: string;
  recipient?: AnyUser;
  value?: { amount?: string; tokenAddress?: string; id: string }[];
  delay?: {
    amount?: string;
    time: string;
  };
  isExpanded?: boolean;
  claimDate?: number;
  claimed?: boolean;
}
