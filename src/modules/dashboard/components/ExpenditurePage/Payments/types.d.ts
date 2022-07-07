import { AnyUser } from '~data/index';

export interface Recipient {
  id?: string;
  recipient?: AnyUser;
  value?: { amount?: number; tokenAddress?: string; id: string }[];
  delay?: {
    amount: string;
    time: string;
  };
  isExpanded?: boolean;
}
