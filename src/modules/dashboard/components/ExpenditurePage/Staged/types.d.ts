import { AnyUser } from '~data/index';

export interface Staged {
  user?: AnyUser;
  amount?: { value?: string; tokenAddress?: string };
  milestones?: {
    id: string;
    name?: string;
    amount?: number;
    percent?: number;
    released?: boolean;
  }[];
}
