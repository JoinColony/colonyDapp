import { MessageDescriptor } from 'react-intl';
import { Recipient } from '~dashboard/ExpenditurePage/Payments/types';

import {
  MotionStatus,
  MotionType,
} from '~dashboard/ExpenditurePage/Stages/types';
import { LoggedInUser } from '~data/generated';
import { Staged as StagedType } from '~dashboard/ExpenditurePage/Staged/types';
import { Split as SplitType } from '~dashboard/ExpenditurePage/Split/types';
import { Batch as BatchType } from '~dashboard/ExpenditurePage/Batch/types';
import {
  FundingSource,
  Rate,
  Streaming as StreamingType,
} from '~dashboard/ExpenditurePage/Streaming/types';
import { DatePickerFieldValue } from '~core/Fields/DatePicker/DatePicker';

export enum ExpenditureTypes {
  Advanced = 'multiple',
  Split = 'split',
  Staged = 'staged',
  Batch = 'batch',
  Streaming = 'streaming',
}

export enum ExpenditureEndDateTypes {
  WhenCancelled = 'when-cancelled',
  LimitIsReached = 'limit-is-reached',
  FixedTime = 'fixed-time',
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
  streaming?: StreamingType;
  fundingSources?: FundingSource;
  rates?: Partial<Rate>;
  amount?: { value?: number; tokenAddress?: string };
  date?: DatePickerFieldValue;
}

export interface StageObject {
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
