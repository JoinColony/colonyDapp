import { AnyUser } from '~data/index';

export interface Recipient {
  user?: AnyUser;
  amount?: { value?: number; tokenAddress?: string };
  percent?: number;
  id?: string;
}

export interface Split {
  unequal?: boolean;
  amount?: { value?: string; tokenAddress?: string };
  recipients?: Recipient[];
}
