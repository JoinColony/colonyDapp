import { MessageDescriptor } from 'react-intl';
import { Recipient } from '~dashboard/ExpenditurePage/Payments/types';

import {
  MotionStatus,
  MotionType,
} from '~dashboard/ExpenditurePage/Stages/constants';
import { LoggedInUser } from '~data/generated';
import { Staged as StagedType } from '~dashboard/ExpenditurePage/Staged/types';
import { Split as SplitType } from '~dashboard/ExpenditurePage/Split/types';
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
  split?: SplitType;
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

export enum DelayTime {
  Hours = 'hours',
  Days = 'days',
  Months = 'months',
}
