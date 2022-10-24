import { AnyUser } from '~data/index';

export interface Recipient {
  id?: string;
  recipient?: AnyUser;
  value?: { amount?: string; tokenAddress?: string; id: string }[];
  delay?: {
    amount?: string;
    time: string;
  };
  isExpanded?: boolean;
  removed?: boolean;
  created?: boolean;
  isChanged?: boolean;
  claimDate?: number;
  claimed?: boolean;
}
