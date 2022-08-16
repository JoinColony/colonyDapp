import { MessageDescriptor } from 'react-intl';
import { Recipient } from '~dashboard/ExpenditurePage/Payments/types';

import {
  MotionStatus,
  MotionType,
} from '~dashboard/ExpenditurePage/Stages/constants';
import { AnyUser } from '~data/index';
import { LoggedInUser } from '~data/generated';
import { Staged as StagedType } from '~dashboard/ExpenditurePage/Staged/types';
import { Batch as BatchType } from '~dashboard/ExpenditurePage/Batch/types';

export enum ExpenditureTypes {
  Advanced = 'advanced',
  Split = 'split',
  Staged = 'staged',
  Batch = 'batch',
}

export interface ValuesType {
  expenditure: ExpenditureTypes;
  filteredDomainId: string;
  owner?:
    | string
    | Pick<
        LoggedInUser,
        'walletAddress' | 'balance' | 'username' | 'ethereal' | 'networkId'
      >;
  recipients?: Recipient[];
  title?: string;
  description?: string;
  split?: {
    unequal?: boolean;
    amount?: { value?: string; tokenAddress?: string };
    recipients?: { user?: AnyUser; amount?: number; percent?: number }[];
  };
  staged?: StagedType;
  batch?: BatchType;
}

export interface State {
  id: string;
  label: string | MessageDescriptor;
  buttonText: string | MessageDescriptor;
  buttonAction: () => void;
  buttonTooltip?: string | MessageDescriptor;
}

export interface Motion {
  type: MotionType;
  status: MotionStatus;
}

export type DelayTime = 'hours' | 'days' | 'months';
