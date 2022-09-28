import { AnyUser } from '~data/index';

export interface Split {
  unequal?: boolean;
  amount?: { value?: string; tokenAddress?: string };
  recipients?: {
    user?: AnyUser;
    amount?: number;
    percent?: number;
    key?: string;
  }[];
}
