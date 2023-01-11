import { AnyUser } from '~data/index';

export interface Milestone {
  id: string;
  name?: string;
  amount?: { value: number; tokenAddress?: string };
  percent?: number;
  released?: boolean;
}

export interface Staged {
  user?: AnyUser;
  amount?: { value?: string; tokenAddress?: string };
  milestones?: Milestone[];
}
